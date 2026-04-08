// src/core/store/authStore.js

import { UserSchema } from "@core/auth/schemas/authSchemas";

/* ------------------------------------------
   STORAGE CONFIG
------------------------------------------ */

const STORAGE = localStorage;

const KEYS = {
  jwt: "auth_jwt",
  session: "auth_session",
  user: "auth_user",
  entidadId: "auth_entidadId",
  apps: "auth_apps",
  version: "auth_version",
};

const VERSION = "2";

/* ------------------------------------------
   HELPERS
------------------------------------------ */

function safeParseJSON(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/* ------------------------------------------
   OBSERVERS
------------------------------------------ */

const listeners = new Set();

function notify() {
  for (const listener of listeners) {
    try {
      listener();
    } catch (error) {
      console.error("authStore listener error:", error);
    }
  }
}

/* ------------------------------------------
   READ STATE
------------------------------------------ */

function readState() {

  const version = STORAGE.getItem(KEYS.version);

  if (version !== VERSION) {
    return null;
  }

  const jwt = STORAGE.getItem(KEYS.jwt);
  const session = STORAGE.getItem(KEYS.session);

  if (!jwt || !session) {
    return null;
  }

  const userRaw = STORAGE.getItem(KEYS.user);
  const appsRaw = STORAGE.getItem(KEYS.apps);
  const entidadIdRaw = STORAGE.getItem(KEYS.entidadId);

  let user = null;

  if (userRaw) {

    const parsed = safeParseJSON(userRaw);

    try {
      user = UserSchema.parse(parsed);
    } catch {
      user = parsed;
    }

  }

  const apps = safeParseJSON(appsRaw, []);

  const entidadId =
    entidadIdRaw !== null ? Number(entidadIdRaw) : null;

  return {
    jwt,
    session,
    user,
    apps: Array.isArray(apps) ? apps : [],
    entidadId,
  };
}

/* ------------------------------------------
   STORE
------------------------------------------ */

export const authStore = {

  /* --------------------------------------
     SUBSCRIBE
  -------------------------------------- */

  subscribe(listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  /* --------------------------------------
     GET
  -------------------------------------- */

  get() {
    return readState();
  },

  /* --------------------------------------
     SET
  -------------------------------------- */

  set({ jwt, session, user, entidadId, apps }) {

    STORAGE.setItem(KEYS.version, VERSION);

    if (jwt !== undefined) {

      if (jwt) STORAGE.setItem(KEYS.jwt, jwt);
      else STORAGE.removeItem(KEYS.jwt);

    }

    if (session !== undefined) {

      if (session) STORAGE.setItem(KEYS.session, session);
      else STORAGE.removeItem(KEYS.session);

    }

    if (user !== undefined) {

      if (user) STORAGE.setItem(KEYS.user, JSON.stringify(user));
      else STORAGE.removeItem(KEYS.user);

    }

    if (entidadId !== undefined) {

      if (entidadId !== null)
        STORAGE.setItem(KEYS.entidadId, String(entidadId));
      else
        STORAGE.removeItem(KEYS.entidadId);

    }

    if (apps !== undefined) {

      STORAGE.setItem(
        KEYS.apps,
        JSON.stringify(Array.isArray(apps) ? apps : [])
      );

    }

    notify();
  },

  /* --------------------------------------
     CLEAR
  -------------------------------------- */

  clear() {

    Object.values(KEYS).forEach((key) => {
      STORAGE.removeItem(key);
    });

    notify();
  },

};