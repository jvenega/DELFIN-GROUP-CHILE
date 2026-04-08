// src/core/config/app.config.js

// Public pages
import Login from "@modules/login/pages/Login";
import RecoverPassword from "@modules/login/pages/RecoverPassword";

// Fallbacks
import Maintenance from "@core/pages/DEFAULT/Maintenance";
import Unauthorized from "@core/pages/DEFAULT/Unauthorized";
import NotFound from "@core/pages/DEFAULT/NotFound";

export const APP_CONFIG = {
  /** Flag de entorno para mantenimiento global */
  maintenanceFlag: "VITE_MAINTENANCE",

  /** Rutas públicas */
  publicRoutes: [
    {
      path: "/login",
      element: Login,
      guestOnly: true,
    },
    {
      path: "/recover-password",
      element: RecoverPassword,
      guestOnly: true,
    },
  ],
  /** Rutas fallback */
  fallbackRoutes: {
    unauthorized: Unauthorized,
    notFound: NotFound,
    maintenance: Maintenance,
  },
};
