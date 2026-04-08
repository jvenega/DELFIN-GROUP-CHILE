import { useState, useMemo } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import {
  useSucursales,
  useCreateMovimiento,
} from "../../service/useApiResources";

export default function MovimientoModal({ open, onClose }) {
  const { data: sucursales = [] } = useSucursales();

  const {
    mutate: createMovimiento,
    loading,
    error,
  } = useCreateMovimiento();

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    Serie: "",
    Rut_Persona: "",
    Observacion: "",
    ID_Sucursal: "",
  });

  const isValid = useMemo(() => {
    return form.Serie.trim() && form.ID_Sucursal;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    try {
      await createMovimiento(form);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch {}
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2>Nuevo Movimiento</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {success && (
          <div className="text-green-600 text-sm flex gap-2 mb-2">
            <CheckCircle className="w-4 h-4" />
            Creado correctamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Serie"
            value={form.Serie}
            onChange={(e) =>
              setForm({ ...form, Serie: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <select
            value={form.ID_Sucursal}
            onChange={(e) =>
              setForm({ ...form, ID_Sucursal: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Sucursal</option>
            {sucursales.map((s) => (
              <option key={s.ID_Sucursal} value={s.ID_Sucursal}>
                {s.Nombre_Sucursal}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-red-500 text-sm">{error.message}</p>
          )}

          <button
            disabled={!isValid || loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}