/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  X,
  Package,
  Tag,
  Layers,
  Boxes,
  FileText,
  DollarSign,
  Truck,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import {
  useCreateArticulo,
  useTipos,
  useMarcas,
  useProveedores,
  useModelos, // ✅ agregado
} from "../../service/useApiResources";

export default function ArticuloModal({ open, onClose }) {
  const mutation = useCreateArticulo();

  const { data: tipos = [] } = useTipos();
  const { data: marcas = [] } = useMarcas();
  const { data: proveedores = [] } = useProveedores();
  const { data: modelos = [] } = useModelos(); // ✅ agregado

  const [proveedorInput, setProveedorInput] = useState("");
  const [proveedorExiste, setProveedorExiste] = useState(false);

  const [form, setForm] = useState({
    serie: "",
    id_marca: "",
    id_modelo: "",
    id_tipo: "",
    factura: "",
    valor_unitario: "",
    rut_proveedor: "",
    fecha_compra: "",
    anios_garantia: "",
    fecha_garantia: "",
  });

  // ==============================
  // DETECTAR PROVEEDOR
  // ==============================
  useEffect(() => {
    if (!proveedorInput) {
      setProveedorExiste(false);
      return;
    }

    const existe = proveedores.find(
      (p) =>
        p.Rut_Proveedor?.toLowerCase() === proveedorInput.toLowerCase()
    );

    if (existe) {
      setProveedorExiste(true);

      setForm((prev) => ({
        ...prev,
        rut_proveedor: existe.Rut_Proveedor,
      }));
    } else {
      setProveedorExiste(false);

      setForm((prev) => ({
        ...prev,
        rut_proveedor: proveedorInput,
      }));
    }
  }, [proveedorInput, proveedores]);

  // ==============================
  // CALCULAR GARANTÍA
  // ==============================
  useEffect(() => {
    if (!form.fecha_compra || !form.anios_garantia) return;

    const fecha = new Date(form.fecha_compra);
    fecha.setFullYear(
      fecha.getFullYear() + Number(form.anios_garantia)
    );

    const formatted = fecha.toISOString().split("T")[0];

    setForm((prev) => ({
      ...prev,
      fecha_garantia: formatted,
    }));
  }, [form.fecha_compra, form.anios_garantia]);

  // ==============================
  // HANDLE CHANGE
  // ==============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // SUBMIT (ALINEADO AL SP)
  // ==============================
  const handleSubmit = async () => {
    try {
      if (
        !form.serie ||
        !form.id_marca ||
        !form.id_modelo ||
        !form.id_tipo
      ) {
        console.log("⛔ Campos obligatorios faltantes");
        return;
      }

      if (!form.fecha_garantia) {
        console.log("⛔ Garantía no calculada");
        return;
      }

      const payload = {
        ACCION: 2,

        serie: form.serie,
        id_marca: Number(form.id_marca),
        id_modelo: Number(form.id_modelo),
        id_tipo: Number(form.id_tipo),

        factura: form.factura || "",
        valor_unitario: Number(form.valor_unitario),

        rut_proveedor: form.rut_proveedor || "",

        fecha_compra: form.fecha_compra,
        fecha_venc_garantia: form.fecha_garantia,
      };

      console.log("📦 Payload final:", payload);

      await mutation.execute(payload);

      handleClose();
    } catch (error) {
      console.error("🔥 Error creando artículo", error);
    }
  };

  const handleClose = () => {
    setProveedorInput("");
    setProveedorExiste(false);

    setForm({
      serie: "",
      id_marca: "",
      id_modelo: "",
      id_tipo: "",
      factura: "",
      valor_unitario: "",
      rut_proveedor: "",
      fecha_compra: "",
      anios_garantia: "",
      fecha_garantia: "",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Nuevo Artículo
            </h2>
            <p className="text-sm text-gray-500">
              Registro de activo TI
            </p>
          </div>

          <button onClick={handleClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* IDENTIFICACIÓN */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Identificación del Equipo
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {/* SERIE */}
              <div className="relative col-span-2">
                <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  name="serie"
                  value={form.serie}
                  onChange={handleChange}
                  placeholder="Serie del equipo (numérico)"
                  className="pl-9 border p-2.5 rounded-lg w-full"
                />
              </div>

              {/* MARCA */}
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="id_marca"
                  value={form.id_marca}
                  onChange={handleChange}
                  className="pl-9 border p-2.5 rounded-lg w-full"
                >
                  <option value="">Marca</option>
                  {marcas.map((m) => (
                    <option key={m.ID_Marca} value={m.ID_Marca}>
                      {m.Glosa_Marca}
                    </option>
                  ))}
                </select>
              </div>

              {/* MODELO ✅ */}
              <div className="relative">
                <Layers className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="id_modelo"
                  value={form.id_modelo}
                  onChange={handleChange}
                  className="pl-9 border p-2.5 rounded-lg w-full"
                >
                  <option value="">Modelo</option>
                  {modelos.map((m) => (
                    <option key={m.ID_Modelo} value={m.ID_Modelo}>
                      {m.Glosa_Modelo}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIPO */}
              <div className="relative">
                <Boxes className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="id_tipo"
                  value={form.id_tipo}
                  onChange={handleChange}
                  className="pl-9 border p-2.5 rounded-lg w-full"
                >
                  <option value="">Tipo</option>
                  {tipos.map((t) => (
                    <option key={t.ID_Tipo} value={t.ID_Tipo}>
                      {t.Glosa_Tipo}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* COMPRA */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Información de Compra
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  name="factura"
                  value={form.factura}
                  onChange={handleChange}
                  placeholder="Factura"
                  className="pl-9 border p-2.5 rounded-lg w-full"
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  name="valor_unitario"
                  type="number"
                  value={form.valor_unitario}
                  onChange={handleChange}
                  placeholder="Valor"
                  className="pl-9 border p-2.5 rounded-lg w-full"
                />
              </div>

              {/* PROVEEDOR */}
              <div className="relative col-span-2">
                <Truck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  value={proveedorInput}
                  onChange={(e) => setProveedorInput(e.target.value)}
                  placeholder="RUT Proveedor"
                  className="pl-9 border p-2.5 rounded-lg w-full"
                />
              </div>

              {/* FEEDBACK */}
              <div className="col-span-2">
                {proveedorInput && proveedorExiste && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Proveedor existente
                  </div>
                )}

                {proveedorInput && !proveedorExiste && (
                  <div className="flex items-center gap-2 text-yellow-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Se creará nuevo proveedor
                  </div>
                )}
              </div>

              {/* FECHA COMPRA */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="fecha_compra"
                  value={form.fecha_compra}
                  onChange={handleChange}
                  className="pl-9 border p-2.5 rounded-lg w-full"
                />
              </div>

              {/* GARANTÍA */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="anios_garantia"
                  value={form.anios_garantia}
                  onChange={handleChange}
                  placeholder="Años de garantía"
                  className="pl-9 border p-2.5 rounded-lg w-full"
                />
              </div>

              {/* RESULTADO */}
              <div className="relative col-span-2">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  value={form.fecha_garantia}
                  readOnly
                  placeholder="Vencimiento garantía"
                  className="pl-9 border p-2.5 rounded-lg w-full bg-gray-100"
                />
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg"
          >
            {mutation.loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}