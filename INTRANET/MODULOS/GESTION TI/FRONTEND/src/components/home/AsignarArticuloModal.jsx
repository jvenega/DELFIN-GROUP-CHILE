
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  X,
  User,
  Hash,
  Package,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";

import { usePersona } from "../../service/useApiResources";
import { useDebounce } from "../../hook/useDebounce";
import { useMutation, useApi } from "../../service/useApi";
import { api } from "../../service/apiService";

export default function AsignarArticuloModal({ open, onClose }) {
  const [rutInput, setRutInput] = useState("");
  const rut = useDebounce(rutInput, 500);

  const [serieInput, setSerieInput] = useState("");
  const serie = useDebounce(serieInput, 400);

  const isRutCompleto = useMemo(
    () => /^\d{7,8}-[0-9kK]$/.test(rut),
    [rut]
  );

  const { data: persona, loading: loadingPersona } = usePersona(
    isRutCompleto ? rut : null
  );

  const { data: articulo } = useApi(
    () => api.articulos.getBySerie(serie),
    [serie],
    { immediate: !!serie }
  );

  const mutation = useMutation(api.createMovimiento);

  const [errorPersona, setErrorPersona] = useState(false);
  const [errorSerie, setErrorSerie] = useState(false);

  const [form, setForm] = useState({
    Serie: "",
    Rut_Persona: "",
    Nombre_Persona: "",
    ID_Sucursal: "",
    Nombre_Sucursal: "",
    Observacion: "",
  });

  // ==============================
  // FORMAT RUT
  // ==============================
  const formatRut = (value) => {
    let clean = value.replace(/[^0-9kK]/g, "");
    if (clean.length <= 1) return clean;
    return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
  };

  // ==============================
  // PERSONA
  // ==============================
  useEffect(() => {
    if (!isRutCompleto) {
      setErrorPersona(false);
      return;
    }

    if (!persona) {
      setErrorPersona(true);
      return;
    }

    setErrorPersona(false);

    setForm((prev) => ({
      ...prev,
      Rut_Persona: persona.RUT,
      Nombre_Persona: `${persona.Nombre} ${persona.ApePaterno}`,
      ID_Sucursal: persona.ID_Sucursal || 5, // 🔥 clave para SP
      Nombre_Sucursal: persona.Sucursal,
    }));
  }, [persona, isRutCompleto]);

  // ==============================
  // SERIE VALIDACIÓN
  // ==============================
  useEffect(() => {
    if (!articulo) return;

    if (articulo.Rut_Persona) {
      setErrorSerie(true);
    } else {
      setErrorSerie(false);
    }
  }, [articulo]);

  // ==============================
  // SUBMIT (ALINEADO SP)
  // ==============================
  const handleSubmit = async () => {
    if (errorSerie) return;

    try {
      const payload = {
        id_estado: 2,
        fecha_asignado: new Date().toISOString(),
        rut_persona: form.Rut_Persona,
        id_sucursal: Number(form.ID_Sucursal) || 5,
        serie: form.Serie,
        responsable: "TI",
        observacion: form.Observacion || "Asignación de equipo",
      };

      console.log("📦 Payload Movimiento:", payload);

      await mutation.execute(payload);

      handleClose();

    } catch (error) {
      console.error("🔥 Error asignando artículo", error);
    }
  };

  // ==============================
  // RESET
  // ==============================
  const handleClose = () => {
    setRutInput("");
    setSerieInput("");
    setErrorPersona(false);
    setErrorSerie(false);

    setForm({
      Serie: "",
      Rut_Persona: "",
      Nombre_Persona: "",
      ID_Sucursal: "",
      Nombre_Sucursal: "",
      Observacion: "",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Asignar Artículo
            </h2>
            <p className="text-sm text-gray-500">
              Asignación de equipo a usuario
            </p>
          </div>
          <button onClick={handleClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* SERIE */}
          <div className="relative">
            <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={serieInput}
              placeholder="Serie del equipo"
              className="pl-9 border p-2 rounded-lg w-full"
              onChange={(e) => {
                setSerieInput(e.target.value);
                setForm((prev) => ({
                  ...prev,
                  Serie: e.target.value,
                }));
              }}
            />
          </div>

          {errorSerie && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              Equipo ya asignado
            </div>
          )}

          {/* RUT */}
          <div className="relative">
            <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={rutInput}
              onChange={(e) => setRutInput(formatRut(e.target.value))}
              placeholder="RUT Persona"
              className="pl-9 border p-2 rounded-lg w-full"
            />

            {loadingPersona && (
              <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin" />
            )}
          </div>

          {errorPersona && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              Persona no encontrada
            </div>
          )}

          {/* NOMBRE */}
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={form.Nombre_Persona}
              readOnly
              placeholder="Nombre"
              className="pl-9 border p-2 rounded-lg w-full bg-gray-100"
            />
          </div>

          {/* SUCURSAL */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={form.Nombre_Sucursal}
              readOnly
              placeholder="Sucursal"
              className="pl-9 border p-2 rounded-lg w-full bg-gray-100"
            />
          </div>

          {/* OBSERVACIÓN */}
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              placeholder="Observación"
              className="pl-9 border p-2 rounded-lg w-full"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  Observacion: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!form.Rut_Persona || !form.Serie || errorSerie}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
          >
            {mutation.loading ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}
 