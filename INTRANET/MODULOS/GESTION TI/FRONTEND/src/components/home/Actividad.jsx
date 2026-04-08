import { useEffect, useMemo, useRef } from "react";
import {
  Clock,
  Wrench,
  Package,
  User,
  RefreshCcw,
  MapPin,
} from "lucide-react";

import { useMovimientos } from "../../service/useApiResources";

// ==============================
// CONFIG
// ==============================
const REFRESH_INTERVAL = 120000;

// ==============================
// HELPERS
// ==============================
const getType = (text) => {
  const t = (text || "").toLowerCase();

  if (t.includes("asignado")) return "asignacion";
  if (t.includes("mant")) return "mantenimiento";

  return "movimiento";
};

const formatTime = (fecha) => {
  if (!fecha) return "--:--";

  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "--:--";

  return d.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getIcon = (type) => {
  switch (type) {
    case "asignacion":
      return <User className="w-4 h-4" />;
    case "mantenimiento":
      return <Wrench className="w-4 h-4" />;
    case "movimiento":
      return <Package className="w-4 h-4" />;
    default:
      return <RefreshCcw className="w-4 h-4" />;
  }
};

export default function Actividad() {
  const { data: rawData, loading, error } = useMovimientos();

  const scrollRef = useRef();

  // ==============================
  // NORMALIZACIÓN DATA (FIX CLAVE)
  // ==============================
  const safeData = useMemo(() => {
    // soporta data.data.data
    if (Array.isArray(rawData)) return rawData;

    if (Array.isArray(rawData?.data?.data)) {
      return rawData.data.data;
    }

    return [];
  }, [rawData]);

  // ==============================
  // NORMALIZACIÓN
  // ==============================
  const activities = useMemo(() => {
    if (!Array.isArray(safeData)) return [];

    return [...safeData]
      .filter((item) => item?.Fecha_movimiento)
      .sort((a, b) => {
        const dateA = new Date(a.Fecha_movimiento).getTime() || 0;
        const dateB = new Date(b.Fecha_movimiento).getTime() || 0;
        return dateA - dateB;
      })
      .map((item) => {
        const text =
          item?.Observacion ||
          `${item?.Nombre_Sucursal || "Sucursal"} - ${
            item?.Responsable || "Sin responsable"
          }`;

        return {
          text,
          time: formatTime(item?.Fecha_movimiento),
          type: getType(text),
          sucursal: item?.Nombre_Sucursal || null,
          responsable: item?.Responsable || null,
        };
      });
  }, [safeData]);

  const lastIndex = activities.length - 1;

  // ==============================
  // AUTO SCROLL
  // ==============================
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth;
    }
  }, [activities]);

  return (
    <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Actividad reciente

          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </h2>

        <span className="text-xs text-gray-400">
          Actualizando automáticamente
        </span>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-gray-400 mb-2">
          Cargando actividad...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-400 mb-2">
          Error al cargar movimientos
        </div>
      )}

      {/* TIMELINE */}
      <div ref={scrollRef} className="overflow-x-auto pb-4">
        <div className="relative flex items-start gap-10 min-w-max">
          <div className="absolute top-6 left-0 right-0 h-px bg-gray-200"></div>

          {activities.map((item, i) => {
            const isLatest = i === lastIndex;

            return (
              <div
                key={i}
                className={`relative flex flex-col items-center w-48 transition ${
                  isLatest ? "scale-105" : "opacity-80"
                }`}
              >
                {/* ICON */}
                <div
                  className={`z-10 w-10 h-10 flex items-center justify-center rounded-full border shadow-sm
                    ${
                      isLatest
                        ? "bg-green-100 text-green-600 ring-2 ring-green-400 animate-pulse"
                        : "bg-blue-100 text-blue-600"
                    }
                  `}
                >
                  {getIcon(item.type)}
                </div>

                {/* CARD */}
                <div
                  className={`mt-4 rounded-lg p-3 w-full text-center transition border
                    ${
                      isLatest
                        ? "bg-green-50 border-green-200 shadow-md"
                        : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-sm"
                    }
                  `}
                >
                  <p
                    className={`text-sm font-medium ${
                      isLatest
                        ? "text-green-700"
                        : "text-gray-800"
                    }`}
                  >
                    {item.text}
                  </p>

                  <span className="text-xs text-gray-400 block mt-1">
                    {item.time}
                  </span>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    {item.sucursal || "—"}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-1">
                    <User className="w-3 h-3" />
                    {item.responsable || "—"}
                  </div>

                  {isLatest && (
                    <span className="text-[10px] text-green-600 mt-1 block font-semibold">
                      Último evento
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}