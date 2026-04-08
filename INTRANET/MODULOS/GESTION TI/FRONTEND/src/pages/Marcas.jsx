import { useMemo, useState } from "react";
import { Loader2, RefreshCw, Tag, Search, X } from "lucide-react";
import { useMarcas } from "../service/useApiResources";

export default function Marcas() {
  const { data: marcas = [], loading, error, refetch } = useMarcas();
  const [query, setQuery] = useState("");

  // ==============================
  // FILTRO
  // ==============================
  const filtered = useMemo(() => {
    if (!query) return marcas;

    const q = query.toLowerCase();

    return marcas.filter((m) =>
      (m.Glosa_Marca || "").toLowerCase().includes(q)
    );
  }, [marcas, query]);

  const initials = (name = "") => name.slice(0, 2).toUpperCase();

  const clearSearch = () => setQuery("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Marcas</h1>
          <p className="text-sm text-gray-500">Catálogo de marcas</p>
        </div>

        <div className="flex items-center gap-2">
          {/* SEARCH */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar marca..."
              className="pl-9 pr-8 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />

            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* REFRESH */}
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
            Recargar
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando{" "}
        <span className="font-medium text-gray-800">
          {filtered.length}
        </span>{" "}
        de {marcas.length}
      </div>

      {/* ================= CONTENIDO ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-gray-200 rounded-xl p-4"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error.message}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            {query ? "Sin resultados para la búsqueda" : "No hay marcas"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {filtered.map((marca) => (
              <div
                key={marca.ID_Marca}
                className="group border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-semibold">
                  {initials(marca.Glosa_Marca)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {marca.Glosa_Marca}
                  </p>

                  <p className="text-xs text-gray-400">
                    ID: {marca.ID_Marca}
                  </p>
                </div>

                {/* Icon */}
                <Tag className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}