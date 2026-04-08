import { useState, useRef, useEffect } from "react";
import {
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown
} from "lucide-react";

import { useAuth } from "@context/Auth/useAuth";
import { LayoutConfig } from "@core/config/styles/layout";

export default function TopbarActions() {

  const { user, logout } = useAuth();

  const { topbar } = LayoutConfig;
  const { actions } = topbar;

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const email = user?.email ?? "usuario@intranet";

  const displayName = email
    .split("@")[0]
    .replace(".", " ")
    .replace(/\b\w/g, l => l.toUpperCase());

  const avatarUrl =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3886F5&color=ffffff`;

  /* cerrar dropdown al hacer click fuera */
  useEffect(() => {

    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  return (

    <div className={actions.container}>

      {/* NOTIFICATIONS */}
      <button className={actions.notifications.button}>
        <Bell size={actions.notifications.iconSize} />
        <span className={actions.notifications.dot} />
      </button>

      {/* USER MENU */}
      <div ref={ref} className="relative">

        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-3
            px-2 py-1
            rounded-lg
            hover:bg-gray-100
            transition
          "
        >

          <img
            src={avatarUrl}
            alt="avatar"
            className="
              h-9 w-9
              rounded-full
              border border-gray-200
              shadow-sm
            "
          />

          <div className="flex flex-col text-left leading-tight">

            <span className="text-sm font-semibold text-gray-800">
              {displayName}
            </span>

            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {user?.role ?? "Sin rol"}
            </span>

          </div>

          <ChevronDown size={16} className="text-gray-400" />

        </button>

        {/* DROPDOWN */}
        {open && (

          <div
            className="
              absolute right-0 mt-2
              w-52
              bg-white
              border border-gray-200
              rounded-xl
              shadow-lg
              overflow-hidden
              z-50
            "
          >

            <button
              className="
                w-full flex items-center gap-3
                px-4 py-2.5
                text-sm
                hover:bg-gray-50
              "
            >
              <User size={16} />
              Perfil
            </button>

            <button
              className="
                w-full flex items-center gap-3
                px-4 py-2.5
                text-sm
                hover:bg-gray-50
              "
            >
              <Settings size={16} />
              Configuración
            </button>

            <div className="border-t border-gray-100" />

            <button
              onClick={logout}
              className="
                w-full flex items-center gap-3
                px-4 py-2.5
                text-sm
                text-red-600
                hover:bg-red-50
              "
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>

          </div>

        )}

      </div>

    </div>
  );

}