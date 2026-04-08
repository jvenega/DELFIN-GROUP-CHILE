import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@context/Auth/useAuth";

import { NavigationContext } from "./NavigationContext";
import { buildExternalRoutes } from "@core/config/buildExternalRoutes";
import { registerSubAppOrigins } from "@core/auth/AuthBridgeIframe";

export function NavigationProvider({ children }) {
  const { apps: authApps } = useAuth();

  const [configApps, setConfigApps] = useState([]);
  const [stableApps, setStableApps] = useState([]);
  const mountedRef = useRef(true);

  /* =========================
     LOAD JSON (fallback)
  ========================= */

  useEffect(() => {
    mountedRef.current = true;

    // solo si backend trae apps válidas
    if (Array.isArray(authApps) && authApps.length > 0) {
      return;
    }

    const isProd = import.meta.env.MODE === "production";
    const url = isProd
      ? "/intranet/config/subapps.json"
      : "/config/subapps.json";


    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("Error HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        if (!mountedRef.current) return;

        const safeApps = Array.isArray(data?.apps) ? data.apps : [];


        if (safeApps.length === 0) {
          console.warn("⚠️ subapps.json sin apps válidas");
        }

        setConfigApps(safeApps);
      })
      .catch(err => {
        if (err.name === "AbortError") return;
        console.error("❌ Error loading subapps.json", err);
      });

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [authApps]);

  /* =========================
     STABLE APPS (FIXED)
  ========================= */

  useEffect(() => {
    if (Array.isArray(authApps) && authApps.length > 0) {
      setStableApps(authApps);
      return;
    }

    if ((!authApps || authApps.length === 0) && configApps.length > 0) {
      setStableApps(configApps);
    }
  }, [authApps, configApps]);


  const apps = stableApps;

  /* =========================
     BUILD ROUTES
  ========================= */

  const routes = useMemo(() => {
    if (!apps.length) {
      return [];
    }

    try {
      const built = buildExternalRoutes(apps);
      return built;
    } catch (err) {
      console.error("❌ Error building routes", err);
      return [];
    }
  }, [apps]);


  /* =========================
     REGISTER ORIGINS
  ========================= */

  const origins = useMemo(() => {
    const result = Array.from(
      new Set(
        apps
          .map(app => {
            try {
              if (!app?.origin) return null;
              return new URL(app.origin).origin;
            } catch {
              console.warn("⚠️ origin inválido:", app?.origin);
              return null;
            }
          })
          .filter(Boolean)
      )
    );


    return result;
  }, [apps]);

  useEffect(() => {

    if (origins.length) {
      registerSubAppOrigins(origins);
    }
  }, [origins]);

  /* =========================
     FINAL CHECKPOINT
  ========================= */

  
  /* =========================
     PROVIDER
  ========================= */

  return (
    <NavigationContext.Provider value={routes}>
      {children}
    </NavigationContext.Provider>
  );
}