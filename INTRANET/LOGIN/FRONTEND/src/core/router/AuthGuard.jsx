import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@context/Auth/useAuth";
import FullScreenLoader from "../ui/FullScreenLoader";

/*
  ============================================================
  🔹 AuthGuard - Guard unificado (enterprise ready)
  ============================================================
*/

export default function AuthGuard({
  private: isPrivate = false,
  guestOnly = false,
  roles = null,
  redirectTo = "/dashboard",
}) {
  const { user, loadingUser, roles: userRoles } = useAuth();
  const location = useLocation();

  // 🔹 Mientras se verifica la sesión
  if (loadingUser) {
    return <FullScreenLoader message="Verificando sesión..." />;
  }

  // 🔹 Rutas SOLO invitados
  if (guestOnly && user) {
    return <Navigate to={redirectTo} replace />;
  }

  // 🔹 Rutas privadas requieren sesión
  if (isPrivate && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 🔹 Validación de roles (RBAC)
  if (roles && user) {
    const allowed = roles.map((r) => r.toUpperCase());
    const hasAccess = userRoles.some((r) => allowed.includes(r));

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 🔹 Acceso permitido
  return <Outlet />;
}
