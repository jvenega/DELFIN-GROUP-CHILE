import { useState } from "react";
import { Plus, UserPlus, Package } from "lucide-react";

import Stats from "../components/home/Stats";
import Sucursales from "../components/home/Sucursales";
import Actividad from "../components/home/Actividad";
import MovimientoModal from "../components/home/MovimientoModal";
import AsignarArticuloModal from "../components/home/AsignarArticuloModal";
import ArticuloModal from "../components/home/ArticuloModal"; // 👈 nuevo

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [openAsignar, setOpenAsignar] = useState(false);
  const [openArticulo, setOpenArticulo] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Panel Principal
          </h1>
          <p className="text-sm text-gray-500">
            Resumen operativo del módulo TI
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex gap-2">

          {/* NUEVO ARTÍCULO */}
          <button
            onClick={() => setOpenArticulo(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <Package className="w-4 h-4" />
            Nuevo Artículo
          </button>

          {/* NUEVA ASIGNACIÓN */}
          <button
            onClick={() => setOpenAsignar(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <UserPlus className="w-4 h-4" />
            Asignar Artículo
          </button>

          {/* NUEVO MOVIMIENTO */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo Movimiento
          </button>

        </div>
      </div>

      <Stats />
      <Sucursales />
      <Actividad />

      {/* MODALES */}
      <MovimientoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      <AsignarArticuloModal
        open={openAsignar}
        onClose={() => setOpenAsignar(false)}
      />

      <ArticuloModal
        open={openArticulo}
        onClose={() => setOpenArticulo(false)}
      />
    </div>
  );
}