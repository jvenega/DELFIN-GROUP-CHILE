import React, {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  Package,
  MapPin,
  User,
  ShieldCheck,
  Calendar,
  Wrench,
  ArchiveX,
} from "lucide-react";
// import { mockMovimientos } from "../mock/movimientos";
import { useMovimientos } from "../service/useApiResources";
// ======================================================
// CONFIG
// ======================================================
const TABLE_HEIGHT = 640;
const ROW_HEIGHT = 48;
const BUFFER = 10;
const DETAIL_PAGE_SIZE = 50;

// ======================================================
// MOCK HOOK
// Reemplazar por hook real cuando exista endpoint de lectura
// ======================================================


// ======================================================
// HELPERS
// ======================================================
function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-CL");
}

function compareDateDesc(a, b) {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}

function buildSerieRows(movimientos) {
  const map = new Map();

  for (let i = 0; i < movimientos.length; i += 1) {
    const mov = movimientos[i];
    const serie = mov?.Serie ?? `SIN_SERIE_${mov?.ID_Movimiento ?? i}`;

    if (!map.has(serie)) {
      map.set(serie, {
        serie,
        movimientos: [],
        count: 0,
        lastFecha: null,
        current: null,
        searchText: "",
      });
    }

    const row = map.get(serie);
    row.movimientos.push(mov);
    row.count += 1;
  }

  const rows = [];

  for (const row of map.values()) {
    row.movimientos.sort((a, b) =>
      compareDateDesc(a?.Fecha_movimiento, b?.Fecha_movimiento)
    );

    row.current = row.movimientos[0] || null;
    row.lastFecha = row.current?.Fecha_movimiento ?? null;

    const current = row.current || {};

    // searchText optimizado: solo resumen actual + identificadores clave
    row.searchText = normalizeText(
      [
        row.serie,
        current.Glosa_Estado,
        current.Nombre_Persona,
        current.Nombre_Sucursal,
        current.Responsable,
        current.Rut_Persona,
        current.Observacion,
      ].join(" ")
    );

    rows.push(row);
  }

  rows.sort((a, b) => compareDateDesc(a.lastFecha, b.lastFecha));
  return rows;
}

function filterRows(rows, query) {
  const q = normalizeText(query);
  if (!q) return rows;
  return rows.filter((row) => row.searchText.includes(q));
}

// ======================================================
// DETAIL TABLE
// ======================================================
const DetailTable = memo(function DetailTable({ movimientos }) {
  const [limit, setLimit] = useState(DETAIL_PAGE_SIZE);
  const visible = movimientos.slice(0, limit);
  const hasMore = movimientos.length > limit;

  return (
    <div className="border-t border-slate-200 bg-slate-50">
      <div className="grid grid-cols-7 gap-2 border-b border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <div>Fecha</div>
        <div>Estado</div>
        <div>Persona</div>
        <div>Sucursal</div>
        <div>Responsable</div>
        <div>Rut</div>
        <div>Observación</div>
      </div>

      {visible.map((m, idx) => (
        <div
          key={m?.ID_Movimiento ?? `${m?.Serie ?? "mov"}-${idx}`}
          className="grid grid-cols-7 gap-2 border-b border-slate-100 px-4 py-2 text-xs text-slate-700"
        >
          <div className="truncate">{formatDate(m?.Fecha_movimiento)}</div>
          <div className="truncate">{m?.Glosa_Estado || "-"}</div>
          <div className="truncate">{m?.Nombre_Persona || "-"}</div>
          <div className="truncate">{m?.Nombre_Sucursal || "-"}</div>
          <div className="truncate">{m?.Responsable || "-"}</div>
          <div className="truncate">{m?.Rut_Persona || "-"}</div>
          <div className="truncate">{m?.Observacion || "-"}</div>
        </div>
      ))}

      {hasMore && (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-xs text-amber-700">
            Mostrando {visible.length} de {movimientos.length} movimientos.
          </div>

          <button
            onClick={() => setLimit((prev) => prev + DETAIL_PAGE_SIZE)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver más
          </button>
        </div>
      )}
    </div>
  );
});

// ======================================================
// SUBCOMPONENTS
// ======================================================
const KpiCard = memo(function KpiCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-2xl font-semibold text-slate-800">{value}</div>
    </div>
  );
});

const EstadoBadge = memo(function EstadoBadge({ estado }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

  switch (estado) {
    case "Disponible":
      return (
        <span className={`${base} bg-emerald-100 text-emerald-700`}>
          Disponible
        </span>
      );
    case "Asignado":
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>
          Asignado
        </span>
      );
    case "Reparacion":
    case "Reparación":
      return (
        <span className={`${base} bg-amber-100 text-amber-700`}>
          Reparación
        </span>
      );
    case "Baja":
      return (
        <span className={`${base} bg-rose-100 text-rose-700`}>
          Baja
        </span>
      );
    case "Retiro":
      return (
        <span className={`${base} bg-slate-200 text-slate-700`}>
          Retiro
        </span>
      );
    default:
      return (
        <span className={`${base} bg-slate-100 text-slate-700`}>
          {estado || "-"}
        </span>
      );
  }
});

const SerieRow = memo(function SerieRow({ row, isExpanded, onToggle }) {
  const current = row.current || {};

  return (
    <div className="border-b border-slate-100">
      <div
        className="grid grid-cols-[48px_180px_140px_1fr_1fr_1fr_170px_100px] gap-3 px-4 text-sm text-slate-700 hover:bg-slate-50"
        style={{ height: ROW_HEIGHT }}
      >
        <div className="flex items-center">
          <button
            onClick={() => onToggle(row.serie)}
            className="rounded p-1 hover:bg-slate-100"
            aria-label={isExpanded ? "Contraer fila" : "Expandir fila"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>

        <div className="flex items-center truncate font-medium text-slate-800">
          {row.serie}
        </div>

        <div className="flex items-center truncate">
          <EstadoBadge estado={current.Glosa_Estado} />
        </div>

        <div className="flex items-center truncate">
          {current.Nombre_Persona || "-"}
        </div>

        <div className="flex items-center truncate">
          {current.Nombre_Sucursal || "-"}
        </div>

        <div className="flex items-center truncate">
          {current.Responsable || "-"}
        </div>

        <div className="flex items-center truncate">
          {formatDate(current.Fecha_movimiento)}
        </div>

        <div className="flex items-center justify-end font-medium">
          {row.count}
        </div>
      </div>

      {isExpanded && <DetailTable movimientos={row.movimientos} />}
    </div>
  );
});

// ======================================================
// MAIN
// ======================================================
export default function Movimientos() {
  const { data: movimientos, loading, error } = useMovimientos();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isSearching = query !== deferredQuery;

  const [expanded, setExpanded] = useState(() => new Set());
  const [scrollTop, setScrollTop] = useState(0);

  const scrollRef = useRef(null);
  const rafRef = useRef(null);

  // ------------------------------------------------------
  // PREPROCESO SOLO CUANDO CAMBIA LA DATA
  // ------------------------------------------------------
  const serieRows = useMemo(() => buildSerieRows(movimientos), [movimientos]);

  // ------------------------------------------------------
  // FILTRO LIVIANO SOBRE RESUMEN
  // ------------------------------------------------------
  const filteredRows = useMemo(
    () => filterRows(serieRows, deferredQuery),
    [serieRows, deferredQuery]
  );

  // ------------------------------------------------------
  // KPIS EN UN SOLO RECORRIDO
  // ------------------------------------------------------
  const stats = useMemo(() => {
    let disponibles = 0;
    let asignados = 0;
    let reparacion = 0;
    let baja = 0;
    let movimientosCount = 0;

    for (let i = 0; i < filteredRows.length; i += 1) {
      const row = filteredRows[i];
      const estado = row.current?.Glosa_Estado || "";

      movimientosCount += row.count;

      if (estado === "Disponible") disponibles += 1;
      else if (estado === "Asignado") asignados += 1;
      else if (estado === "Reparacion" || estado === "Reparación")
        reparacion += 1;
      else if (estado === "Baja") baja += 1;
    }

    return {
      series: filteredRows.length,
      movimientos: movimientosCount,
      disponibles,
      asignados,
      reparacion,
      baja,
    };
  }, [filteredRows]);

  // ------------------------------------------------------
  // VIRTUALIZACION DE FILAS MAESTRAS
  // ------------------------------------------------------
  const totalRows = filteredRows.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const visibleCount = Math.ceil(TABLE_HEIGHT / ROW_HEIGHT) + BUFFER * 2;
  const endIndex = Math.min(totalRows, startIndex + visibleCount);
  const visibleRows = filteredRows.slice(startIndex, endIndex);
  const topSpacerHeight = startIndex * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (totalRows - endIndex) * ROW_HEIGHT);

  // ------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------
  const handleScroll = useCallback((e) => {
    const nextScrollTop = e.currentTarget.scrollTop;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(nextScrollTop);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggleExpand = useCallback((serie) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(serie)) next.delete(serie);
      else next.add(serie);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setExpanded(new Set());
    setScrollTop(0);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-450 space-y-4">
        {/* HEADER */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Gestión de Movimientos
              </h1>
              <p className="text-sm text-slate-500">
                Vista SAP optimizada para grandes volúmenes
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-105">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por serie, persona, sucursal, estado, responsable..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {isSearching ? "Buscando..." : "Filtro listo"}
                </div>

                <button
                  onClick={clearFilters}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* KPIS */}
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-6">
            <KpiCard label="Series" value={stats.series} icon={Package} />
            <KpiCard
              label="Movimientos"
              value={stats.movimientos}
              icon={Calendar}
            />
            <KpiCard
              label="Disponibles"
              value={stats.disponibles}
              icon={ShieldCheck}
            />
            <KpiCard
              label="Asignados"
              value={stats.asignados}
              icon={User}
            />
            <KpiCard
              label="Reparación"
              value={stats.reparacion}
              icon={Wrench}
            />
            <KpiCard label="Baja" value={stats.baja} icon={ArchiveX} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* HEADER TABLA */}
          <div className="grid grid-cols-[48px_180px_140px_1fr_1fr_1fr_170px_100px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <div></div>
            <div>Serie</div>
            <div>Estado actual</div>
            <div>Persona actual</div>
            <div>Sucursal actual</div>
            <div>Responsable actual</div>
            <div>Último movimiento</div>
            <div className="text-right"># Mov</div>
          </div>

          {/* BODY */}
          {loading ? (
            <div className="flex h-80 items-center justify-center text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Cargando movimientos...
            </div>
          ) : error ? (
            <div className="flex h-80 items-center justify-center text-red-600">
              Error al cargar movimientos
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-slate-500">
              Sin resultados
            </div>
          ) : (
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="overflow-y-auto"
              style={{ height: TABLE_HEIGHT }}
            >
              <div style={{ height: topSpacerHeight }} />

              {visibleRows.map((row) => (
                <SerieRow
                  key={row.serie}
                  row={row}
                  isExpanded={expanded.has(row.serie)}
                  onToggle={toggleExpand}
                />
              ))}

              <div style={{ height: bottomSpacerHeight }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}