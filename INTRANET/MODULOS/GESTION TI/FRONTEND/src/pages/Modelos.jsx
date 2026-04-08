import { useMemo, useState } from "react";
import { Loader2, RefreshCw, Search, X } from "lucide-react";
import { useModelos } from "../service/useApiResources";

export default function Modelos() {
  const { data: modelos = [], loading, error, refetch } = useModelos();
  const [query, setQuery] = useState("");

  // ==============================
  // FILTRO
  // ==============================
  const filtered = useMemo(() => {
    if (!query) return modelos;

    const q = query.toLowerCase();

    return modelos.filter((m) =>
      `${m.Glosa_Modelo || ""} ${m.Clase_Modelo || ""} ${m.Descripcion_Modelo || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [modelos, query]);

  const clearSearch = () => setQuery("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Modelos
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de modelos
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* SEARCH */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar modelo..."
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
        de {modelos.length}
      </div>

      {/* ================= TABLA ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Cargando modelos...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error.message}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {query ? "Sin resultados para la búsqueda" : "No hay modelos"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 w-20">ID</th>
                <th className="text-left px-4 py-3">Modelo</th>
                <th className="text-left px-4 py-3 w-32">Clase</th>
                <th className="text-left px-4 py-3">
                  Descripción
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((modelo) => (
                <tr
                  key={modelo.ID_Modelo}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-700">
                    {modelo.ID_Modelo}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800 max-w-75 truncate">
                    {modelo.Glosa_Modelo}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                      {modelo.Clase_Modelo || "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600 max-w-100 truncate">
                    {modelo.Descripcion_Modelo || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}