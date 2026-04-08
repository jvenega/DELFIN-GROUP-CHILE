/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { useNavigationRoutes } from "@core/context/routes/useNavigationRoutes";
import { useAuth } from "@context/Auth/useAuth";
import { LayoutConfig } from "@core/config/styles/layout";

import {
  AppWindow,
  ExternalLink
} from "lucide-react";

export default function SidebarNav({ collapsed = false }) {

  const routes = useNavigationRoutes() || [];
  const { user } = useAuth();

  const { navbar } = LayoutConfig.sidebar;

  // 🔹 Normalización de roles
  const userRoles = useMemo(() => {
    if (!user?.roles) return [];

    return user.roles
      .filter(Boolean)
      .map(r => String(r).toUpperCase());
  }, [user]);

  // 🔹 Validación de acceso robusta
  const hasAccess = useCallback((routeRoles) => {
    if (!routeRoles || routeRoles.length === 0) return true;

    const normalizedRouteRoles = Array.isArray(routeRoles)
      ? routeRoles
      : [routeRoles];

    return normalizedRouteRoles.some(r =>
      userRoles.includes(String(r).toUpperCase())
    );
  }, [userRoles]);

  // 🔹 Procesamiento de rutas seguro
  const { internal, external } = useMemo(() => {

    const safeRoutes = Array.isArray(routes) ? routes : [];

    const filtered = safeRoutes
      .filter(r => r?.menu) // evita undefined
      .filter(r => hasAccess(r.roles))
      .sort((a, b) => (a.menu?.order ?? 999) - (b.menu?.order ?? 999));

    return {
      internal: filtered.filter(r => r.type === "internal"),
      external: filtered.filter(r => r.type === "external")
    };

  }, [routes, hasAccess]);

  // 🔹 Render interno optimizado
  const renderInternal = useCallback((route) => {

    const Icon = route?.menu?.icon;

    if (!Icon || !route?.path) return null;

    return (
      <NavLink
        key={`internal-${route.path}`}
        to={route.path}
        title={collapsed ? route.menu.label : undefined}
        className={({ isActive }) =>
          `
          ${navbar.itemBase}
          ${collapsed ? navbar.itemCollapsed : navbar.itemExpanded}
          ${isActive ? navbar.itemActive : navbar.itemInactive}
          `
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className={navbar.activeIndicator.className} />
            )}

            <div className={navbar.icon.wrapper}>
              <Icon
                size={navbar.icon.size}
                className={
                  isActive
                    ? navbar.icon.activeColor
                    : navbar.icon.inactiveColor
                }
              />
            </div>

            {!collapsed && (
              <span className={navbar.label.className}>
                {route.menu.label || "Sin nombre"}
              </span>
            )}
          </>
        )}
      </NavLink>
    );

  }, [collapsed, navbar]);

  // 🔹 Render externo optimizado
  const renderExternal = useCallback((route) => {

    const Icon = route?.menu?.icon;
    const href = route?.externalLink || route?.src;

    if (!Icon || !href) return null;

    return (
      <a
        key={`external-${href}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={collapsed ? route.menu.label : undefined}
        className={`
          ${navbar.itemBase}
          ${collapsed ? navbar.itemCollapsed : navbar.itemExpanded}
          ${navbar.itemInactive}
        `}
      >
        <div className={navbar.icon.wrapper}>
          <Icon
            size={navbar.icon.size}
            className={navbar.icon.inactiveColor}
          />
        </div>

        {!collapsed && (
          <>
            <span className={navbar.label.className}>
              {route.menu.label || "Enlace"}
            </span>

            <ExternalLink
              size={14}
              className="ml-auto opacity-60"
            />
          </>
        )}
      </a>
    );

  }, [collapsed, navbar]);

  return (
    <nav className={navbar.container}>

      {/* 🔹 Estado vacío */}
      {internal.length === 0 && external.length === 0 && (
        <div className="p-4 text-sm text-gray-400">
          No hay aplicaciones disponibles
        </div>
      )}

      {/* INTERNAS */}
      {internal.length > 0 && !collapsed && (
        <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 flex items-center gap-2">
          <AppWindow size={14} />
          Aplicaciones
        </div>
      )}

      {internal.map(renderInternal)}

      {/* EXTERNAS */}
      {external.length > 0 && !collapsed && (
        <div className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 flex items-center gap-2">
          <ExternalLink size={14} />
          Enlaces externos
        </div>
      )}

      {external.map(renderExternal)}

    </nav>
  );
}