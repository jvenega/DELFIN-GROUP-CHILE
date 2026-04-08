import { NavLink } from "react-router-dom";
import { Home } from "lucide-react";
import { useMemo } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { ROUTE_LABELS } from "@core/config/navigation/routeLabels";

export default function TopbarBreadcrumbs() {
  const rawBreadcrumbs = useBreadcrumbs(ROUTE_LABELS);

  const breadcrumbs = useMemo(() => {
    if (!Array.isArray(rawBreadcrumbs)) return [];
    return rawBreadcrumbs.filter(Boolean);
  }, [rawBreadcrumbs]);

  const hasBreadcrumbs = breadcrumbs.length > 0;

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="flex items-center flex-wrap gap-2 text-sm"
        role="list"
      >
        {/* HOME */}
        <li className="flex items-center">
          <NavLink
            to="/"
            aria-label="Inicio"
            className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <Home size={18} />
          </NavLink>
        </li>

        {/* BREADCRUMBS */}
        {hasBreadcrumbs &&
          breadcrumbs.map((crumb, index) => {
            if (!crumb?.path || !crumb?.label) return null;

            const isLast = index === breadcrumbs.length - 1;

            return (
              <li
                key={`${crumb.path}-${index}`}
                className="flex items-center gap-2"
              >
                {/* separator accesible */}
                <span
                  className="text-gray-300 select-none"
                  aria-hidden="true"
                >
                  /
                </span>

                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-gray-900 font-semibold text-base sm:text-lg truncate max-w-45"
                    title={crumb.label}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <NavLink
                    to={crumb.path}
                    className="text-gray-500 hover:text-gray-900 transition truncate max-w-35"
                    title={crumb.label}
                  >
                    {crumb.label}
                  </NavLink>
                )}
              </li>
            );
          })}
      </ol>
    </nav>
  );
}