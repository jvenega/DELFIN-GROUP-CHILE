import { useMemo, useState } from "react";
import {
  Loader2,
  Search,
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Scan,
  Camera,
  Router,
  Network,
  Usb,
  X,
} from "lucide-react";
import { useTipos } from "../service/useApiResources";

const Tipos = () => {
  const { data: tipos = [], loading, error } = useTipos();
  const [query, setQuery] = useState("");

  // ==============================
  // ICON MAP
  // ==============================
  const getIcon = (tipo = "") => {
    const t = tipo.toLowerCase();

    if (t.includes("notebook")) return <Laptop className="w-5 h-5" />;
    if (t.includes("pantalla")) return <Monitor className="w-5 h-5" />;
    if (t.includes("teclado")) return <Keyboard className="w-5 h-5" />;
    if (t.includes("mouse")) return <Mouse className="w-5 h-5" />;
    if (t.includes("dock")) return <Usb className="w-5 h-5" />;
    if (t.includes("escaner")) return <Scan className="w-5 h-5" />;
    if (t.includes("access")) return <Router className="w-5 h-5" />;
    if (t.includes("camara")) return <Camera className="w-5 h-5" />;
    if (t.includes("switch")) return <Network className="w-5 h-5" />;

    return <span>📦</span>;
  };

  // ==============================
  // FILTRO
  // ==============================
  const filtered = useMemo(() => {
    if (!query) return tipos;

    const q = query.toLowerCase();

    return tipos.filter((t) =>
      (t.Glosa_Tipo || "").toLowerCase().includes(q)
    );
  }, [tipos, query]);

  const clearSearch = () => setQuery("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Tipos
          </h1>
          <p className="text-sm text-gray-500">
            Clasificación de equipos
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tipo..."
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
      </div>

      {/* STATS */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando{" "}
        <span className="font-medium text-gray-800">
          {filtered.length}
        </span>{" "}
        de {tipos.length}
      </div>

      {/* CONTENIDO */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Cargando tipos...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error.message}
          </div>
        ) : tipos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay tipos registrados
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Sin resultados para la búsqueda
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((tipo) => (
              <div
                key={tipo.ID_Tipo}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition"
              >
                {/* ICONO */}
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  {getIcon(tipo.Glosa_Tipo)}
                </div>

                {/* NOMBRE */}
                <p className="text-sm font-medium text-gray-800">
                  {tipo.Glosa_Tipo}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tipos;