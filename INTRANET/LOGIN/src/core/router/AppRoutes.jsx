import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useMemo } from "react";

import AuthGuard from "./AuthGuard";
import RoleGuard from "../../core/auth/RoleGuard";

import MainLayout from "../layout/MainLayout";
import { APP_CONFIG } from "../config/app.config";

import { useNavigationRoutes } from "@core/context/routes/useNavigationRoutes";

/* ==========================================================
   LAZY LOAD
========================================================== */

const IntranetDashboard = lazy(() =>
  import("../../modules/intranet/pages/Dashboard")
);

/* ==========================================================
   LOADING FALLBACK
========================================================== */

function RouteLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-sm text-slate-500 animate-pulse">
        Cargando módulo…
      </div>
    </div>
  );
}

/* ==========================================================
   APP ROUTES
========================================================== */

export default function AppRoutes() {

  const navigationRoutesRaw = useNavigationRoutes();

  const navigationRoutes = useMemo(() => {
    return navigationRoutesRaw ?? [];
  }, [navigationRoutesRaw]);

  /* ======================================================
     NORMALIZAR RUTAS PRIVADAS
  ====================================================== */

  const privateRoutes = useMemo(() => {
    return navigationRoutes.filter((route) => {
      return (
        route?.path &&
        route?.element &&
        route?.type === "internal"
      );
    });
  }, [navigationRoutes]);

  /* ======================================================
     MODO MANTENIMIENTO
  ====================================================== */

  if (import.meta.env[APP_CONFIG.maintenanceFlag] === "true") {
    const Maintenance = APP_CONFIG.fallbackRoutes.maintenance;

    return (
      <Routes>
        <Route path="*" element={<Maintenance />} />
      </Routes>
    );
  }

  /* ======================================================
     ROUTER PRINCIPAL
  ====================================================== */

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>

        {/* =================================================
           RUTAS PÚBLICAS
        ================================================= */}

        <Route element={<AuthGuard guestOnly redirectTo="/dashboard" />}>

          {APP_CONFIG.publicRoutes.map((route) => {
            const Page = route.element;

            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Page />}
              />
            );
          })}

        </Route>

        {/* =================================================
           RUTAS PRIVADAS
        ================================================= */}

        <Route element={<AuthGuard private redirectTo="/login" />}>

          <Route element={<MainLayout />}>

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={<IntranetDashboard />}
            />

            {/* REDIRECCIÓN BASE */}
            <Route
              index
              element={<Navigate to="/dashboard" replace />}
            />

            {/* =================================================
               RUTAS DINÁMICAS
            ================================================= */}

            {privateRoutes.map((route) => {

              const {
                path,
                element: Element,
                elementProps,
                roles
              } = route;

              const content = <Element {...elementProps} />;

              const guardedContent =
                Array.isArray(roles) && roles.length > 0
                  ? (
                    <RoleGuard allowedRoles={roles}>
                      {content}
                    </RoleGuard>
                  )
                  : content;

              return (
                <Route
                  key={path}
                  path={path}
                  element={guardedContent}
                />
              );
            })}

            {/* =================================================
               NOT FOUND INTERNO
            ================================================= */}

            <Route
              path="*"
              element={<APP_CONFIG.fallbackRoutes.notFound />}
            />

          </Route>

        </Route>

        {/* =================================================
           RUTAS GLOBALES
        ================================================= */}

        <Route
          path="/unauthorized"
          element={<APP_CONFIG.fallbackRoutes.unauthorized />}
        />

        <Route
          path="*"
          element={<APP_CONFIG.fallbackRoutes.notFound />}
        />

      </Routes>
    </Suspense>
  );
}