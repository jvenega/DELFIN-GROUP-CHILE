/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  X,
} from "lucide-react";
import { useProveedores } from "../service/useApiResources";
import { formatRut } from "../utils/rut.format";

export default function Proveedores() {
  const [query, setQuery] = useState("");

  const { data: proveedores = [], loading, error, refetch } =
    useProveedores();

  // ==============================
  // FORMATO TELÉFONO
  // ==============================
  const formatPhone = (num) => {
    if (!num) return "";

    const cleaned = num.toString().replace(/\D/g, "");

    if (cleaned.length === 11) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(
        2,
        3
      )} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
    }

    if (cleaned.length === 9) {
      return `+56 ${cleaned[0]} ${cleaned.slice(
        1,
        5
      )} ${cleaned.slice(5)}`;
    }

    return num;
  };

  // ==============================
  // AGRUPAR
  // ==============================
  const grouped = useMemo(() => {
    const groups = {};

    proveedores.forEach((p) => {
      const key = p.Nombre_Proveedor || "Sin nombre";

      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    return Object.entries(groups);
  }, [proveedores]);

  // ==============================
  // FILTRO
  // ==============================
  const filteredGroups = useMemo(() => {
    if (!query) return grouped;

    const q = query.toLowerCase();

    return grouped
      .map(([nombre, items]) => {
        const filteredItems = items.filter((p) =>
          `${p.Nombre_Proveedor || ""} ${
            p.Persona_Contacto || ""
          } ${p.Rut_Proveedor || ""}`
            .toLowerCase()
            .includes(q)
        );

        return [nombre, filteredItems];
      })
      .filter(([_, items]) => items.length > 0);
  }, [grouped, query]);

  const clearSearch = () => setQuery("");

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Proveedores
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de proveedores
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* SEARCH */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar proveedor o contacto..."
              className="pl-9 pr-8 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
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

          {/* RELOAD */}
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
            Recargar
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-4 text-sm text-gray-600">
        Empresas:{" "}
        <span className="font-medium text-gray-800">
          {filteredGroups.length}
        </span>{" "}
        de {grouped.length}
      </div>

      {/* CONTENIDO */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Cargando proveedores...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error.message}
          </div>
        ) : proveedores.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay proveedores registrados
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Sin resultados para la búsqueda
          </div>
        ) : (
          filteredGroups.map(([nombre, items]) => (
            <div
              key={nombre}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              {/* HEADER EMPRESA */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {nombre}
                  </h2>
                </div>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {items.length} contacto(s)
                </span>
              </div>

              {/* CONTACTOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((prov) => (
                  <div
                    key={`${prov.Rut_Proveedor}-${prov.Persona_Contacto}`}
                    className="border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition"
                  >
                    {/* CONTACTO */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {prov.Persona_Contacto || "Sin contacto"}
                      </span>
                    </div>

                    {/* RUT */}
                    <div className="text-xs text-gray-500 mb-2">
                      {formatRut(prov.Rut_Proveedor)}
                    </div>

                    {/* INFO */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {prov.Correo_Contacto || "-"}
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {formatPhone(prov.Celular_Contacto)}
                      </div>
                    </div>

                    {/* SERVICIOS */}
                    <div className="mt-2 pt-2 border-t text-xs text-gray-500 flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      {prov.Servicios_Prestados || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}