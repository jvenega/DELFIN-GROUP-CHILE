// src/utils/sessionTimeout.js

const MINUTE = 60 * 1000;

/* ============================
   CONFIG DESDE ENV (VITE)
============================ */

const ENV_CONFIG = {
  idleMs: Number(import.meta.env.VITE_SESSION_IDLE_MS),
  warnBeforeMs: Number(import.meta.env.VITE_SESSION_WARN_BEFORE_MS),
  storageKey: import.meta.env.VITE_SESSION_STORAGE_KEY,
  broadcastKey: import.meta.env.VITE_SESSION_BROADCAST_KEY,
};

/* ============================
   DEFAULTS + VALIDACIÓN
============================ */

const DEFAULT_CONFIG = {
  idleMs: 15 * MINUTE,
  warnBeforeMs: 5 * MINUTE,
  storageKey: "SESSION_EXP_AT",
  broadcastKey: "SESSION_EVENT",
};

function normalizeConfig(env, custom = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...env, ...custom };

  if (!Number.isFinite(cfg.idleMs) || cfg.idleMs <= 0) {
    cfg.idleMs = DEFAULT_CONFIG.idleMs;
  }

  if (!Number.isFinite(cfg.warnBeforeMs) || cfg.warnBeforeMs < 0) {
    cfg.warnBeforeMs = DEFAULT_CONFIG.warnBeforeMs;
  }

  if (cfg.warnBeforeMs >= cfg.idleMs) {
    cfg.warnBeforeMs = Math.floor(cfg.idleMs / 2);
  }

  if (!cfg.storageKey) cfg.storageKey = DEFAULT_CONFIG.storageKey;
  if (!cfg.broadcastKey) cfg.broadcastKey = DEFAULT_CONFIG.broadcastKey;

  return cfg;
}

/* ============================
   STATE
============================ */

let cfg = normalizeConfig(ENV_CONFIG);

let expAt = null;
let isRunning = false;
let isInitialized = false;

let warnTimer = null;
let hardTimer = null;

let warnEmitted = null;
let expiredEmitted = null;

let storageHandler = null;
let bc = null;

/* ACTIVITY */
let activityHandler = null;
let lastActivityTs = 0;
const activityThrottleMs = 1000;

/* VISIBILITY */
let hiddenSince = null;
const MAX_HIDDEN_TIME = 30 * MINUTE;

/* HOOKS BACKEND */
let refreshHandler = null;

/* ============================
   LISTENERS
============================ */

const listeners = {
  warn: new Set(),
  expired: new Set(),
  start: new Set(),
  extend: new Set(),
  stop: new Set(),
  clear: new Set(),
};

const emit = (type, payload) => {
  listeners[type]?.forEach(fn => {
    try { fn(payload); } catch { /* empty */ }
  });
};

/* ============================
   SAFE UTILS
============================ */

const hasWindow = () => typeof window !== "undefined";

const safeStorage = {
  get: (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set: (k, v) => {
    try { localStorage.setItem(k, v); } catch { /* empty */ }
  },
  remove: (k) => {
    try { localStorage.removeItem(k); } catch { /* empty */ }
  }
};

const now = () => Date.now();

/* ============================
   BROADCAST
============================ */

function initBroadcast() {
  if (!hasWindow()) return;

  if ("BroadcastChannel" in window) {
    bc = new BroadcastChannel(cfg.broadcastKey);
    bc.onmessage = (e) => handleBroadcast(e.data);
  }
}

function closeBroadcast() {
  if (bc) {
    bc.close();
    bc = null;
  }
}

function sendBroadcast(type, payload = {}) {
  const msg = { type, payload, ts: now() };

  if (bc) {
    bc.postMessage(msg);
  } else {
    safeStorage.set(cfg.broadcastKey, JSON.stringify(msg));
  }
}

/* ============================
   STORAGE
============================ */

function persistExpAt(value) {
  expAt = value;

  if (!value) {
    safeStorage.remove(cfg.storageKey);
    return;
  }

  safeStorage.set(cfg.storageKey, String(value));
}

function loadExpAt() {
  const raw = safeStorage.get(cfg.storageKey);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/* ============================
   TIMERS
============================ */

function clearTimers() {
  clearTimeout(warnTimer);
  clearTimeout(hardTimer);
}

function resetFlags() {
  warnEmitted = null;
  expiredEmitted = null;
}

/* ============================
   CORE EVENTS
============================ */

function notifyWarn(msLeft) {
  if (!expAt || warnEmitted === expAt) return;
  warnEmitted = expAt;
  emit("warn", { expAt, msLeft });
}

async function notifyExpired({ broadcast = false } = {}) {
  if (!expAt || expiredEmitted === expAt) return;

  expiredEmitted = expAt;

  // intento refresh antes de expirar
  if (refreshHandler) {
    try {
      await refreshHandler();
      extendSessionTimeout({ source: "refresh" });
      return;
    } catch {
      // fallback a expire
    }
  }

  if (broadcast) sendBroadcast("EXPIRE");

  emit("expired", { expAt, msLeft: 0 });
}

/* ============================
   SCHEDULER
============================ */

function schedule() {
  clearTimers();

  if (!isRunning || !expAt) return;

  const msLeft = expAt - now();

  if (msLeft <= 0) {
    notifyExpired();
    return;
  }

  const warnIn = expAt - cfg.warnBeforeMs - now();

  if (warnIn <= 0) {
    notifyWarn(msLeft);
  } else {
    warnTimer = setTimeout(() => {
      notifyWarn(expAt - now());
    }, warnIn);
  }

  hardTimer = setTimeout(() => {
    notifyExpired({ broadcast: true });
  }, msLeft);
}

/* ============================
   ACTIVITY
============================ */

function handleUserActivity() {
  const ts = now();

  if (ts - lastActivityTs < activityThrottleMs) return;

  lastActivityTs = ts;

  extendSessionTimeout({ source: "activity" });
}

function attachActivityListeners() {
  if (!hasWindow() || activityHandler) return;

  activityHandler = handleUserActivity;

  ["mousemove", "mousedown", "keydown", "scroll", "touchstart"]
    .forEach(e => window.addEventListener(e, activityHandler, { passive: true }));
}

function detachActivityListeners() {
  if (!hasWindow() || !activityHandler) return;

  ["mousemove", "mousedown", "keydown", "scroll", "touchstart"]
    .forEach(e => window.removeEventListener(e, activityHandler));

  activityHandler = null;
}

/* ============================
   VISIBILITY
============================ */

function attachVisibilityHandler() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      hiddenSince = now();
    } else {
      if (hiddenSince && now() - hiddenSince > MAX_HIDDEN_TIME) {
        notifyExpired();
      } else {
        expAt = loadExpAt();
        schedule();
      }
    }
  });
}

/* ============================
   OFFLINE / ONLINE
============================ */

function attachConnectionHandlers() {
  window.addEventListener("offline", stopSessionTimeout);
  window.addEventListener("online", startSessionTimeout);
}

/* ============================
   BROADCAST HANDLER
============================ */

function handleBroadcast(msg) {
  if (!msg?.type) return;

  if (msg.type === "EXTEND") {
    expAt = loadExpAt();
    resetFlags();
    schedule();
    emit("extend", { expAt, source: "external" });
  }

  if (msg.type === "EXPIRE") {
    notifyExpired();
  }

  if (msg.type === "CLEAR") {
    expAt = null;
    clearTimers();
    resetFlags();
    emit("clear", {});
  }
}

/* ============================
   STORAGE LISTENER
============================ */

function attachStorageListener() {
  if (!hasWindow() || storageHandler) return;

  storageHandler = (e) => {
    if (e.key === cfg.broadcastKey && e.newValue) {
      try {
        handleBroadcast(JSON.parse(e.newValue));
      } catch { /* empty */ }
    }
  };

  window.addEventListener("storage", storageHandler);
}

/* ============================
   PUBLIC API
============================ */

export function initSessionTimeout({ config, onRefresh } = {}) {
  cfg = normalizeConfig(ENV_CONFIG, config);
  expAt = loadExpAt();

  // rehidratación segura
  if (expAt && expAt < now()) {
    expAt = null;
    safeStorage.remove(cfg.storageKey);
  }

  refreshHandler = onRefresh || null;

  initBroadcast();
  attachStorageListener();
  attachVisibilityHandler();
  attachConnectionHandlers();

  isInitialized = true;
}

export function startSessionTimeout() {
  if (!isInitialized) initSessionTimeout();

  isRunning = true;

  attachActivityListeners();

  if (!expAt) {
    persistExpAt(now() + cfg.idleMs);
    resetFlags();
    sendBroadcast("START");
    emit("start", { expAt });
  }

  schedule();
}

export function stopSessionTimeout() {
  isRunning = false;
  clearTimers();
  detachActivityListeners();
  closeBroadcast();
  emit("stop", {});
}

export function clearSessionTimeoutState() {
  isRunning = false;
  expAt = null;

  clearTimers();
  resetFlags();

  detachActivityListeners();
  closeBroadcast();

  safeStorage.remove(cfg.storageKey);
  sendBroadcast("CLEAR");

  emit("clear", {});
}

export function extendSessionTimeout({ source = "manual" } = {}) {
  if (!isRunning) return false;

  persistExpAt(now() + cfg.idleMs);
  resetFlags();

  schedule();
  sendBroadcast("EXTEND", { source });

  emit("extend", { expAt, source });

  return true;
}

export function expireSessionTimeout() {
  clearTimers();
  notifyExpired({ broadcast: true });
}

export function getSessionTimeLeftMs() {
  return expAt ? Math.max(0, expAt - now()) : 0;
}

export function subscribeSessionTimeout(event, cb) {
  if (!listeners[event]) return () => {};
  listeners[event].add(cb);
  return () => listeners[event].delete(cb);
}