import { Building2, Loader2 } from "lucide-react";
import { useSucursales } from "../../service/useApiResources";

export default function Sucursales() {
  const { data: sucursales = [], loading, error } = useSucursales();

  return (
    <div className="mt-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-gray-500" />
        Sucursales
      </h2>

      {loading ? (
        <div className="flex justify-center py-8 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Cargando...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          {error.message}
        </div>
      ) : !sucursales.length ? (
        <div className="text-gray-400 text-center py-8">
          Sin sucursales
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sucursales.map((suc) => (
            <div
              key={suc.ID_Sucursal}
              className="border p-3 rounded-lg hover:bg-gray-50 flex gap-3"
            >
              <div>🏢</div>
              <div>
                <p className="text-sm font-semibold">
                  {suc.Nombre_Sucursal}
                </p>
                <p className="text-xs text-gray-500">
                  {suc.Descripcion || "Sin descripción"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}