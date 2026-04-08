import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { SubAppConfig } from "./subapp.config";

/* =========================================================
   CACHE
========================================================= */

const serviceCache = new Map();

/* =========================================================
   HELPERS
========================================================= */

function isInternalOrigin(origin) {
  return SubAppConfig.INTERNAL_ORIGINS.some(o => origin.includes(o));
}

async function isServiceAlive(url) {
  const cached = serviceCache.get(url);
  const now = Date.now();

  if (cached && now - cached.ts < SubAppConfig.CACHE_TTL) {
    return cached.ok;
  }

  let ok = false;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SubAppConfig.TIMEOUT);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timer);
    ok = res.ok;
  } catch {
    ok = false;
  }

  serviceCache.set(url, { ok, ts: now });

  return ok;
}

/* =========================================================
   HOOK
========================================================= */

export function useSubAppHealth({ src, skipHealthCheck = false }) {
  const [status, setStatus] = useState("idle");

  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  const origin = useMemo(() => {
    try {
      return new URL(src).origin;
    } catch {
      return null;
    }
  }, [src]);

  const safeSetStatus = useCallback((value) => {
    if (mountedRef.current) setStatus(value);
  }, []);

  const checkService = useCallback(async () => {
    if (!origin) return safeSetStatus("error");

    if (skipHealthCheck || !isInternalOrigin(origin)) {
      return safeSetStatus("ready");
    }

    safeSetStatus("checking");

    const start = Date.now();
    const alive = await isServiceAlive(origin);

    const delay = Math.max(
      0,
      SubAppConfig.MIN_CHECK_TIME - (Date.now() - start)
    );

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      safeSetStatus(alive ? "ready" : "error");
    }, delay);

  }, [origin, skipHealthCheck, safeSetStatus]);

  useEffect(() => {
    mountedRef.current = true;
    checkService();

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, [src, checkService]);

  return {
    status,
    checkService,
    origin
  };
}