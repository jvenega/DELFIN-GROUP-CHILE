import {
  LoginResponseSchema,
  RefreshResponseSchema,
} from "@core/auth/schemas/authSchemas";
import { authFetch } from "../auth/authClient";
import { authStore } from "@core/store/authStore";

/* ============================================================
   CONFIG
============================================================ */

// const BFF_BASE =
//   import.meta.env.VITE_AUTH_API_URL || "http://localhost:4001/bff/api/auth";

// const API_KEY = import.meta.env.VITE_API_KEY || "";

const isDev = import.meta.env.DEV;

// if (!BFF_BASE) {
//   throw new Error(
//     "❌ VITE_AUTH_API_URL o VITE_API_URL no está definido en .env"
//   );
// }

const BASE = import.meta.env.VITE_API_URL;

if (isDev) {
  console.log("🔧 ENTRANDO EN MODO DESARROLLO , UTILIZANDO API BASE URL:", BASE);
}

/* ============================================================
   HELPERS
============================================================ */

function buildHeaders(extra = {}) {
  return {
    ...extra,
    // ✔️ SOLO agrega apikey fuera de dev
    // ...(!isDev && API_KEY ? { apikey: API_KEY } : {}),
  };
}

/* ============================================================
   LOGIN
============================================================ */

export async function apiLogin(rutOrEmail, password) {
  const data = await authFetch(`${BASE}/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ rutOrEmail, password }),
  });

  return LoginResponseSchema.parse(data);
}

/* ============================================================
   REFRESH TOKEN
============================================================ */

export async function apiRefresh(jwt, session) {
  const data = await authFetch(`${BASE}/refresh`, {
    method: "POST",
    headers: buildHeaders({
      Authorization: `Bearer ${jwt}`,
      "x-session-token": session,
    }),
  });

  return RefreshResponseSchema.parse(data);
}

/* ============================================================
   LOGOUT
============================================================ */

export async function apiLogout(session, jwt) {
  await authFetch(`${BASE}/logout`, {
    method: "POST",
    headers: buildHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-session-token": session,
    }),
  });
}

/* ============================================================
   RECOVERY
============================================================ */

export async function apiRecovery(email) {
  return authFetch(`${BASE}/recover`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ correo: email }),
  });
}

/* ============================================================
   RESET PASSWORD
============================================================ */

export async function apiResetPassword(
  correo,
  codigo,
  nuevaClave
) {
  return authFetch(`${BASE}/reset-password`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ correo, codigo, nuevaClave }),
  });
}

/* ============================================================
   SESSION
============================================================ */

export async function apiSession() {
  const snapshot = authStore.get();

  if (!snapshot) {
    throw new Error("NO_SESSION");
  }

  return authFetch(`${BASE}/session`, {
    method: "GET",
    headers: buildHeaders({
      Authorization: `Bearer ${snapshot.jwt}`,
      "x-session-token": snapshot.session,
    }),
  });
}