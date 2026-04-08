/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { useEstados } from "../service/useApiResources";

export default function Estados() {
  const { data: estados = [], loading, error, refetch } = useEstados();
  const [search, setSearch] = useState("");

  // ==============================
  // FILTRO LOCAL (tipo SAP básico)
  // ==============================
  const filtered = useMemo(() => {
    if (!search) return estados;

    return estados.filter((e) =>
      `${e.Glosa_Estado} ${e.Descripcion}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, estados]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Estados
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de estados de activos
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* BUSCADOR */}
          <div className="flex items-center bg-white border rounded-md px-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="px-2 py-1 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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

      {/* ================= CONTENIDO ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Cargando estados...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error.message}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay resultados
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 w-20">ID</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">
                  Descripción
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((estado) => (
                <tr
                  key={estado.ID_Estado}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-700">
                    {estado.ID_Estado}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {estado.Glosa_Estado}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {estado.Descripcion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      {!loading && !error && (
        <div className="mt-4 text-sm text-gray-500">
          {filtered.length} de {estados.length} registros
        </div>
      )}
    </div>
  );
}