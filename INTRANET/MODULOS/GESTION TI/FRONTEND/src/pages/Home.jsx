import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  UserPlus,
  Package,
  LayoutDashboard,
  Boxes,
  Truck,
  Users,
} from "lucide-react";

import AsignarArticuloModal from "../components/home/AsignarArticuloModal";
import ArticuloModal from "../components/home/ArticuloModal";
import hero from "../assets/data-work.svg";

export default function Home() {
  const [modal, setModal] = useState(null);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const openModal = (type) => setModal(type);
  const closeModal = () => setModal(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-14">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative">

        {/* LOADER */}
        {loadingGlobal && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white z-50 ${toast.type === "error" ? "bg-red-500" : "bg-green-600"
            }`}>
            {toast.message}
          </div>
        )}

        {/* HERO */}
        <div className="relative overflow-hidden rounded-2xl bg-white border shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800">
                  Gestión de Activos TI
                </h1>
              </div>
               
              


              <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-500 max-w-xl">
                Control centralizado de artículos, asignaciones y movimientos del area TI.
              </p>

              {/* BOTONES */}
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
                <button
                  onClick={() => openModal("articulo")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-40 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  Nuevo Artículo
                </button>

                <button
                  onClick={() => openModal("asignar")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-40 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  Asignar
                </button>

                
              </div>
            </div>

            {/* SVG */}
            <div className="hidden lg:flex items-center justify-center p-6 xl:p-10 bg-gray-50">
              <img
                src={hero}
                alt="TI Hero"
                className="w-full h-auto max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
              />
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* INVENTARIO */}
          <div
            onClick={() => navigate("/articulos")}
            className="bg-white p-5 rounded-xl border hover:shadow active:scale-[0.98] transition cursor-pointer group flex items-center gap-4"
          >
            <div className="p-3 bg-purple-100 rounded-lg">
              <Boxes className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 group-hover:text-purple-600">
                Inventario
              </p>
              <p className="text-base font-semibold">
                Ver Inventario
              </p>
            </div>
          </div>

          {/* PROVEEDORES */}
          <div
            onClick={() => navigate("/proveedores")}
            className="bg-white p-5 rounded-xl border hover:shadow active:scale-[0.98] transition cursor-pointer group flex items-center gap-4"
          >
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 group-hover:text-blue-600">
                Proveedores
              </p>
              <p className="text-base font-semibold">
                Ver Proveedores
              </p>
            </div>
          </div>

          {/* MODELOS */}
          <div
            onClick={() => navigate("/modelo")}
            className="bg-white p-5 rounded-xl border hover:shadow active:scale-[0.98] transition cursor-pointer group flex items-center gap-4"
          >
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 group-hover:text-green-600">
                Modelos
              </p>
              <p className="text-base font-semibold">
                Ver Modelos
              </p>
            </div>
          </div>

        </div>


        {/* MODALES */}
       
        <AsignarArticuloModal
          open={modal === "asignar"}
          onClose={closeModal}
          setLoadingGlobal={setLoadingGlobal}
        />

        <ArticuloModal
          open={modal === "articulo"}
          onClose={closeModal}
          setLoadingGlobal={setLoadingGlobal}
          onSuccess={() => showToast("Artículo creado")}
          onError={() => showToast("Error al crear artículo", "error")}
        />
      </div>
    </div>
  );
}