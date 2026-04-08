import { useMemo, useState } from "react";
import { useAuth } from "@context/Auth/useAuth";
import { LayoutConfig } from "@core/config/styles/layout";

export default function SidebarFooter({ collapsed = false }) {
  const { user } = useAuth();

  const { footer } = LayoutConfig.sidebar;
  const { avatar } = footer;

  // 🔹 Normalización de datos de usuario
  const normalizedUser = useMemo(() => {
    return {
      email: user?.email || footer.guest.email || "guest@example.com",
      role: user?.role || footer.guest.role || "Invitado",
    };
  }, [user, footer.guest]);

  const { email, role } = normalizedUser;

  // 🔹 Estado para fallback de imagen
  const [imgError, setImgError] = useState(false);

  // 🔹 Generación de avatar optimizada
  const avatarUrl = useMemo(() => {
    if (imgError) return null;

    const params = new URLSearchParams({
      name: email,
      background: avatar.background || "ccc",
      color: avatar.color || "000",
    });

    return `https://ui-avatars.com/api/?${params.toString()}`;
  }, [email, avatar.background, avatar.color, imgError]);

  return (
    <div className={footer.container}>

      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`Avatar de ${email}`}
          className={`
            ${avatar.size}
            ${avatar.rounded}
            ${avatar.border}
            shrink-0
          `}
          onError={() => setImgError(true)}
        />
      ) : (
        // 🔹 Fallback si falla la imagen
        <div
          className={`
            ${avatar.size}
            ${avatar.rounded}
            ${avatar.border}
            flex items-center justify-center bg-gray-300 text-gray-700 font-semibold shrink-0
          `}
        >
          {email.charAt(0).toUpperCase()}
        </div>
      )}

      {/* User info */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">

          <p
            className={footer.email}
            title={email} // 🔹 tooltip útil
          >
            {email}
          </p>

          <span className={footer.role}>
            {role}
          </span>

        </div>
      )}

    </div>
  );
}