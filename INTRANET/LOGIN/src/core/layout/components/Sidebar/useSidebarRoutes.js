// useSidebarRoutes.js
import { useMemo } from "react";
import { useNavigationRoutes } from "@core/context/routes/useNavigationRoutes";
import { useAuth } from "@AuthContext/useAuth";

export function useSidebarRoutes() {
  const routes = useNavigationRoutes() || [];
  const { user } = useAuth();

  const userRoles = useMemo(() => {
    if (!user?.roles) return [];
    return user.roles.map(r => String(r).toUpperCase());
  }, [user]);

  const hasAccess = (routeRoles) => {
    if (!routeRoles?.length) return true;
    const roles = Array.isArray(routeRoles) ? routeRoles : [routeRoles];
    return roles.some(r => userRoles.includes(String(r).toUpperCase()));
  };

  return useMemo(() => {
    return routes
      .filter(r => r?.menu)
      .filter(r => hasAccess(r.roles))
      .sort((a, b) => (a.menu?.order ?? 999) - (b.menu?.order ?? 999));
  }, [routes, userRoles]);
}