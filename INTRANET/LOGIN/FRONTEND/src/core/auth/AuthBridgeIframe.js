// src/core/auth/AuthBridgeIframe.js

import { authStore } from "@core/store/authStore";

let initialized = false;

const allowedOrigins = new Set([
  window.location.origin,
]);

/* -----------------------------
   REGISTRO DE ORIGINS
----------------------------- */

export function registerSubAppOrigins(origins = []) {
  origins.forEach((o) => {
    if (o) allowedOrigins.add(o);
  });
}

/* -----------------------------
   HELPERS
----------------------------- */

function sendAuthContext(target, origin, requestId) {

  const snapshot = authStore.get();

  if (!snapshot) {
    target.postMessage(
      { type: "NO_SESSION", requestId },
      origin
    );
    return;
  }

  const { jwt, session, user, entidadId } = snapshot;

  target.postMessage(
    {
      type: "AUTH_CONTEXT",
      requestId,
      payload: { jwt, session, user, entidadId },
    },
    origin
  );
}

/* -----------------------------
   INIT
----------------------------- */

export function initIframeAuthBridge() {

  if (initialized) return;

  initialized = true;

  window.addEventListener("message", (event) => {

    const { origin, data, source } = event;

    if (!allowedOrigins.has(origin)) return;

    if (!data || typeof data !== "object") return;

    const { type, requestId } = data;

    /* -------------------------
       REQUEST CONTEXT
    ------------------------- */

    if (type === "REQUEST_AUTH_CONTEXT") {

      sendAuthContext(source, origin, requestId);

    }

  });

}