import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { AppProvider } from "./core/providers/AppProvider";
import AppRoutes from "./core/router/AppRoutes";

import { NavigationProvider } from "@context/routes/NavigationProvider";

import MotionProvider from "./core/providers/MotionProvider";

import { Toaster } from "react-hot-toast";
import { toastConfig } from "./core/ui/toastConfig";

import { initIframeAuthBridge } from "./core/auth/AuthBridgeIframe";

/* =========================
   INIT GLOBAL AUTH BRIDGE
========================= */

initIframeAuthBridge();

/* =========================
   BOOTSTRAP APP
========================= */

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <MotionProvider>

      {/* Auth debe ir primero */}
      <AppProvider>

        {/* Navigation depende de Auth */}
        <NavigationProvider>

          <AppRoutes />
          <Toaster {...toastConfig} />

        </NavigationProvider>

      </AppProvider>

    </MotionProvider>

  </StrictMode>
);