// src/core/context/Auth/RoleGuard.jsx

import Unauthorized from "@core/pages/DEFAULT/Unauthorized";
import { useAuth } from "@core/context/Auth/useAuth";

const EMPTY_ROLES = [];

export default function RoleGuard({ allowedRoles = EMPTY_ROLES, children }) {
  const { user } = useAuth();

  if (!user) return null;

  if (!allowedRoles.length) {
    return children;
  }

  const userRoles = Array.isArray(user.roles)
    ? user.roles.map((role) => String(role).trim().toUpperCase())
    : [];

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).trim().toUpperCase()
  );

  const hasPermission = userRoles.some((role) =>
    normalizedAllowedRoles.includes(role)
  );

  if (!hasPermission) {
    return <Unauthorized />;
  }

  return children;
}