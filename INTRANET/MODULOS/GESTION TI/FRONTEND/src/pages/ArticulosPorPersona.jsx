/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import {
  Loader2,
  Search,
  User,
  Building2,
  Laptop,
  Calendar,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Boxes,
} from "lucide-react";
import { useArticulos } from "../service/useApiResources";

// ==============================
// SAFE HELPERS
// ==============================
const safeText = (v) => (v ? String(v) : "-");

const safeNumber = (v) =>
  typeof v === "number" && !isNaN(v) ? v : null;

// ==============================
// KPI CARD
// ==============================
function KpiCard({ label, value, icon: Icon, active, onClick, variant }) {
  const variants = {
    default: "bg-white text-gray-800",
    sin: "bg-gray-100 text-gray-700",
    asignado: "bg-green-50 text-green-700",
    mantenimiento: "bg-yellow-50 text-yellow-700",
    baja: "bg-red-50 text-red-700",
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-xl border cursor-pointer transition flex items-center justify-between
        ${variants[variant] || variants.default}
        ${
          active
            ? "ring-2 ring-blue-500 shadow-md scale-[1.02]"
            : "border-gray-200 hover:shadow-sm"
        }
      `}
    >
      <div>
        <div className="text-xs uppercase opacity-70">{label}</div>
        <div className="text-2xl font-bold">{value ?? 0}</div>
      </div>

      {Icon && <Icon className="w-6 h-6 opacity-70" />}
    </div>
  );
}

// ==============================
// MAIN
// ==============================
export default function ArticulosPorPersona() {
  const { data: articulos, loading, error } = useArticulos();

  const [query, setQuery] = useState("");
  const [personaFiltro, setPersonaFiltro] = useState("");
  const [sucursalFiltro, setSucursalFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  // ==============================
  // KPIs
  // ==============================
  const kpis = useMemo(() => {
    if (!Array.isArray(articulos)) {
      return { total: 0, sin: 0, asignado: 0, mant: 0, baja: 0 };
    }

    let sin = 0,
      asignado = 0,
      mant = 0,
      baja = 0;

    for (const a of articulos) {
      const estado = (a?.Glosa_Estado || "").toLowerCase();

      if (!a?.Nombre_Persona) sin++;
      if (estado.includes("asignado")) asignado++;
      else if (estado.includes("mant")) mant++;
      else if (estado.includes("baja")) baja++;
    }

    return {
      total: articulos.length,
      sin,
      asignado,
      mant,
      baja,
    };
  }, [articulos]);

  // ==============================
  // FILTRO + AGRUPACIÓN
  // ==============================
  const dataProcesada = useMemo(() => {
    if (!Array.isArray(articulos)) return {};

    const q = query.toLowerCase();

    const filtrados = articulos.filter((a) => {
      if (!a) return false;

      const estado = (a.Glosa_Estado || "").toLowerCase();

      return (
        (!q ||
          a.Serie?.toLowerCase()?.includes(q) ||
          a.Nombre_Persona?.toLowerCase()?.includes(q) ||
          a.Marca?.toLowerCase()?.includes(q) ||
          a.Modelo?.toLowerCase()?.includes(q)) &&
        (!personaFiltro || a.Nombre_Persona === personaFiltro) &&
        (!sucursalFiltro || a.Nombre_Sucursal === sucursalFiltro) &&
        (!estadoFiltro ||
          estadoFiltro === "SIN"
            ? !a.Nombre_Persona
            : estado.includes(estadoFiltro))
      );
    });

    return filtrados.reduce((acc, item, index) => {
      const key = item?.Nombre_Persona || "SIN ASIGNAR";
      if (!acc[key]) acc[key] = [];

      acc[key].push({
        ...item,
        __rowId: `${item?.Serie || "no-serie"}-${index}`, // KEY SEGURA
      });

      return acc;
    }, {});
  }, [articulos, query, personaFiltro, sucursalFiltro, estadoFiltro]);

  const personas = useMemo(() => {
    if (!Array.isArray(articulos)) return [];
    return [
      ...new Set(
        articulos.map((a) => a?.Nombre_Persona).filter(Boolean)
      ),
    ];
  }, [articulos]);

  const sucursales = useMemo(() => {
    if (!Array.isArray(articulos)) return [];
    return [
      ...new Set(
        articulos.map((a) => a?.Nombre_Sucursal).filter(Boolean)
      ),
    ];
  }, [articulos]);

  // ==============================
  // HELPERS VISUALES
  // ==============================
  const getEstadoColor = (estado) => {
    const e = (estado || "").toLowerCase();

    if (e.includes("asignado")) return "bg-green-100 text-green-700";
    if (e.includes("mant")) return "bg-yellow-100 text-yellow-700";
    if (e.includes("baja")) return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-600";
  };

  const getGarantiaColor = (dias) => {
    const d = safeNumber(dias);

    if (d == null) return "text-gray-400";
    if (d <= 15) return "text-red-600 font-semibold";
    if (d <= 30) return "text-yellow-600 font-semibold";
    return "text-green-600";
  };

  // ==============================
  // ESTADOS UI
  // ==============================
  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 border rounded">
        Error al cargar datos
      </div>
    );
  }

  if (!Array.isArray(articulos) || articulos.length === 0) {
    return (
      <div className="p-6 text-gray-500 border rounded bg-gray-50">
        No hay datos disponibles
      </div>
    );
  }

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Laptop className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">
          Equipos asignados por persona
        </h2>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Total" value={kpis.total} icon={Boxes} active={!estadoFiltro} onClick={() => setEstadoFiltro("")} />
        <KpiCard label="Sin asignar" value={kpis.sin} icon={User} active={estadoFiltro === "SIN"} onClick={() => setEstadoFiltro("SIN")} variant="sin" />
        <KpiCard label="Asignados" value={kpis.asignado} icon={ShieldCheck} active={estadoFiltro === "asignado"} onClick={() => setEstadoFiltro("asignado")} variant="asignado" />
        <KpiCard label="Mantenimiento" value={kpis.mant} icon={Wrench} active={estadoFiltro === "mant"} onClick={() => setEstadoFiltro("mant")} variant="mantenimiento" />
        <KpiCard label="Baja" value={kpis.baja} icon={AlertTriangle} active={estadoFiltro === "baja"} onClick={() => setEstadoFiltro("baja")} variant="baja" />
      </div>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center border rounded-lg px-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="w-full p-2 outline-none"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select className="border rounded-lg p-2" value={personaFiltro} onChange={(e) => setPersonaFiltro(e.target.value)}>
          <option value="">Todas las personas</option>
          {personas.map((p, i) => (
            <option key={`${p}-${i}`}>{p}</option>
          ))}
        </select>

        <select className="border rounded-lg p-2" value={sucursalFiltro} onChange={(e) => setSucursalFiltro(e.target.value)}>
          <option value="">Todas las sucursales</option>
          {sucursales.map((s, i) => (
            <option key={`${s}-${i}`}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLA */}
      <div className="overflow-auto border rounded-lg">
        <table className="w-full table-fixed text-sm">

          <thead className="bg-gray-100 sticky top-0 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Serie</th>
              <th className="px-3 py-2 text-left">Responsable</th>
              <th className="px-3 py-2 text-center">Estado</th>
              <th className="px-3 py-2 text-right">Garantía</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Marca / Modelo</th>
              <th className="px-3 py-2 text-left">Sucursal</th>
              <th className="px-3 py-2 text-center">Asignado</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(dataProcesada).map(([persona, items]) => (
              <>
                {items.map((a) => (
                  <tr key={a.__rowId} className="border-t hover:bg-gray-50 text-xs">

                    <td className="px-3 py-2 font-medium">{safeText(a.Serie)}</td>

                    <td className="px-3 py-2">
                      {a.Nombre_Persona || (
                        <span className="text-red-600 font-semibold">Sin asignar</span>
                      )}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${getEstadoColor(a.Glosa_Estado)}`}>
                        {safeText(a.Glosa_Estado)}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-right">
                      <span className={getGarantiaColor(a.Dias_Rest_Garantia)}>
                        {safeNumber(a.Dias_Rest_Garantia) ?? "-"} días
                      </span>
                    </td>

                    <td className="px-3 py-2">{safeText(a.Glosa_Tipo)}</td>

                    <td className="px-3 py-2">
                      {safeText(a.Marca)} {safeText(a.Modelo)}
                    </td>

                    <td className="px-3 py-2 text-gray-500 text-xs">
                      {safeText(a.Nombre_Sucursal)}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {safeText(a.Fecha_Asignado)}
                    </td>

                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}