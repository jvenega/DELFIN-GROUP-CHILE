/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import toast from "react-hot-toast";

import { authStore } from "../../store/authStore";
import { apiLogin, apiLogout } from "@core/api/apiAuth";

import SessionExpiryModal from "../../../components/ui/SessionExpiryModal";

import {
  initSessionTimeout,
  startSessionTimeout,
  stopSessionTimeout,
  clearSessionTimeoutState,
  extendSessionTimeout,
  subscribeSessionTimeout,
} from "../../../utils/sessionTimeout";

/* ========================================================
   CONTEXT
======================================================== */

export const AuthContext = createContext(null);

/* ========================================================
   NORMALIZADOR
======================================================== */

const normalizeUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== "object") return null;

  const email =
    rawUser.email ||
    rawUser.Correo ||
    rawUser.mail ||
    rawUser.username ||
    "";

  const role =
    rawUser.role ||
    rawUser.Rol ||
    rawUser.rol ||
    "";

  const rolesRaw =
    rawUser.roles ??
    rawUser.Roles ??
    role ??
    [];

  const roles = (Array.isArray(rolesRaw) ? rolesRaw : [rolesRaw])
    .filter((r) => r !== null && r !== undefined)
    .map((r) => String(r).trim().toUpperCase())
    .filter(Boolean);

  return {
    ...rawUser,
    email,
    role: role ? String(role).trim().toUpperCase() : roles[0] || "",
    roles,
  };
};

/* ========================================================
   HELPERS STORE
======================================================== */

const getStoredAuthSnapshot = () => {
  try {
    const stored = authStore.get();

    if (!stored || typeof stored !== "object") return null;

    return {
      user: stored.user || null,
      session: stored.session || null,
      jwt: stored.jwt || null,
      entidadId: stored.entidadId ?? null,
      apps: Array.isArray(stored.apps) ? stored.apps : [],
    };
  } catch {
    return null;
  }
};

const emitAuthSyncEvent = () => {
  try {
    localStorage.setItem("auth_event", String(Date.now()));
  } catch { /* empty */ }
};

/* ========================================================
   PROVIDER
======================================================== */

export const AuthProvider = ({ children, queryClient }) => {

  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(null);

  const isBlocked = blockedUntil && Date.now() < blockedUntil;

  const getRemainingBlockTime = useCallback(() => {
    if (!blockedUntil) return 0;
    return Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
  }, [blockedUntil]);

  const logoutInProgress = useRef(false);
  const mountedRef = useRef(true);

  /* ========================================================
     APPLY SNAPSHOT
  ======================================================== */

  const applySnapshotToState = useCallback((snapshot) => {
    if (!snapshot?.jwt || !snapshot?.session) {
      setUser(null);
      setApps([]);
      return;
    }

    setUser(normalizeUser(snapshot.user));
    setApps(Array.isArray(snapshot.apps) ? snapshot.apps : []);
  }, []);

  /* ========================================================
     LOGOUT (ROBUSTO)
  ======================================================== */

  const logout = useCallback(
    async (notifyBackend = true) => {
      if (logoutInProgress.current) return;

      logoutInProgress.current = true;

      try {
        const snapshot = getStoredAuthSnapshot();

        if (notifyBackend && snapshot?.session && snapshot?.jwt) {
          try {
            await apiLogout(snapshot.session, snapshot.jwt);
            toast.success("Sesión cerrada", { duration: 2000 });
          } catch (err) {
            console.warn("Logout backend falló", err);
          }
        }

        stopSessionTimeout();
        clearSessionTimeoutState();

        authStore.clear();

        if (mountedRef.current) {
          setShowExpiryModal(false);
          setUser(null);
          setApps([]);
        }

        queryClient?.clear?.();
        emitAuthSyncEvent();

      } finally {
        logoutInProgress.current = false;
      }
    },
    [queryClient]
  );

  /* ========================================================
     INIT SESSION TIMEOUT (CLAVE)
  ======================================================== */

  useEffect(() => {
    mountedRef.current = true;

    initSessionTimeout({
      config: {
        idleMs: 15 * 60 * 1000,
        warnBeforeMs: 60 * 1000,
      },
    });

    const unsubWarn = subscribeSessionTimeout("warn", () => {
      if (!mountedRef.current) return;
      setShowExpiryModal(true);
    });

    const unsubExpired = subscribeSessionTimeout("expired", () => {
      if (!mountedRef.current) return;
      logout(true);
    });

    return () => {
      mountedRef.current = false;
      unsubWarn();
      unsubExpired();
      stopSessionTimeout();
    };
  }, [logout]);

  /* ========================================================
     RESTORE SESSION
  ======================================================== */

  const restoreSession = useCallback(async () => {
    const snapshot = getStoredAuthSnapshot();

    applySnapshotToState(snapshot);

    if (snapshot?.jwt && snapshot?.session) {
      setShowExpiryModal(false);
      startSessionTimeout();
    } else {
      setShowExpiryModal(false);
      stopSessionTimeout();
      clearSessionTimeoutState();
    }

    if (mountedRef.current) {
      setLoadingUser(false);
    }
  }, [applySnapshotToState]);

  /* ========================================================
     LOGIN (ROBUSTO)
  ======================================================== */

  const login = useCallback(async (rutOrEmail, password) => {

    if (isBlocked) {
      const remaining = getRemainingBlockTime();
      toast.error(`Cuenta bloqueada temporalmente (${remaining}s)`);
      return;
    }

    try {
      const data = await apiLogin(rutOrEmail, password);

      const normalizedUser = normalizeUser(data?.user);

      authStore.set({
        user: normalizedUser,
        session: data?.session ?? null,
        jwt: data?.jwt ?? null,
        entidadId: data?.entidadId ?? null,
        apps: Array.isArray(data?.apps) ? data.apps : [],
      });

      setUser(normalizedUser);
      setApps(Array.isArray(data?.apps) ? data.apps : []);

      setAttempts(0);
      setBlockedUntil(null);

      setShowExpiryModal(false); // 🔥 IMPORTANTE

      startSessionTimeout();
      emitAuthSyncEvent();

      toast.success("Sesión iniciada");

      return data;

    } catch (err) {

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      if (status === 401) {
        setAttempts((prev) => {
          const next = prev + 1;

          if (next === 2) {
            toast.error("Te queda 1 intento antes del bloqueo");
          } else if (next >= 3) {
            toast.error("Cuenta bloqueada por múltiples intentos");
            setBlockedUntil(Date.now() + 60 * 1000);
          } else {
            toast.error("Usuario o contraseña incorrectos");
          }

          return next;
        });
      }

      else if (status === 403 || status === 423) {
        toast.error("Tu cuenta ha sido bloqueada. Contacta soporte");
      }

      else if (status === 429) {
        toast.error("Demasiados intentos. Intenta más tarde");
      }

      else if (message?.toLowerCase().includes("bloque")) {
        toast.error("Cuenta bloqueada temporalmente");
      }

      else {
        toast.error(message || "Error al iniciar sesión");
      }

      throw err;
    }

  }, [isBlocked, getRemainingBlockTime]);

  /* ========================================================
     INIT
  ======================================================== */

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /* ========================================================
     ROLES
  ======================================================== */

  const roles = useMemo(() => user?.roles || [], [user]);

  /* ========================================================
     VALUE
  ======================================================== */

  const value = useMemo(
    () => ({
      user,
      apps,
      loadingUser,

      isAuthenticated: !!user,

      roles,

      hasRole: (role) =>
        roles.includes(String(role).trim().toUpperCase()),

      hasAnyRole: (arr = []) =>
        arr.some((r) =>
          roles.includes(String(r).trim().toUpperCase())
        ),

      hasAllRoles: (arr = []) =>
        arr.every((r) =>
          roles.includes(String(r).trim().toUpperCase())
        ),

      login,
      logout,

      getJwt: () => getStoredAuthSnapshot()?.jwt || null,

      attempts,
      isBlocked,
      blockedUntil,
      getRemainingBlockTime,
    }),
    [
      user,
      apps,
      loadingUser,
      roles,
      login,
      logout,
      attempts,
      isBlocked,
      blockedUntil,
      getRemainingBlockTime,
    ]
  );

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <AuthContext.Provider value={value}>
      {children}

      <SessionExpiryModal
        open={showExpiryModal && !!user}
        onExtend={() => {
          const ok = extendSessionTimeout({ source: "modal" });

          if (ok) {
            setShowExpiryModal(false);
            toast.success("Sesión extendida");
          }
        }}
        onLogout={() => logout(true)}
      />
    </AuthContext.Provider>
  );
};