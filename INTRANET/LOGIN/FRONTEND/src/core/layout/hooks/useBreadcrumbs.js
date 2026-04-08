import { useLocation } from "react-router-dom";
import { useMemo } from "react";

/**
 * routeMap:
 * {
 *   "/usuarios": "Usuarios",
 *   "/usuarios/:id": (id) => `Usuario ${id}`,
 *   "/inventario": "Inventario"
 * }
 */
export function useBreadcrumbs(routeMap = {}, options = {}) {
  const { pathname } = useLocation();

  const {
    includeHome = false, // 🔥 cambio clave
    homeLabel = "Inicio",
    homePath = "/",
    hiddenSegments = []
  } = options;

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    let currentPath = "";

    segments.forEach((segment) => {
      if (hiddenSegments.includes(segment)) return;

      currentPath += `/${segment}`;

      const routeKey = findRouteKey(routeMap, currentPath);
      const label = resolveLabel(routeMap[routeKey], segment);

      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    if (includeHome) {
      breadcrumbs.unshift({
        label: homeLabel,
        path: homePath
      });
    }

    return breadcrumbs;
  }, [pathname, routeMap, includeHome, homeLabel, homePath, hiddenSegments]);
}

function findRouteKey(routeMap, path) {
  if (routeMap[path]) return path;

  // match dinámico: /users/:id
  return Object.keys(routeMap).find((key) => {
    if (!key.includes(":")) return false;

    const regex = new RegExp(
      "^" + key.replace(/:\w+/g, "[^/]+") + "$"
    );

    return regex.test(path);
  });
}

function resolveLabel(config, segment) {
  if (typeof config === "function") {
    return config(segment);
  }

  if (typeof config === "string") {
    return config;
  }

  return formatSegment(segment);
}

function formatSegment(seg) {
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
