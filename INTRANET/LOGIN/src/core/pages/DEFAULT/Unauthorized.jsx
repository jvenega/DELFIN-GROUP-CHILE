import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
      <ShieldAlert size={80} className="text-yellow-600 mb-4 animate-pulse" />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Acceso Restringido
      </h1>

      <p className="text-gray-600 max-w-md mb-6">
        No tienes permisos para acceder a este módulo.  
        Si crees que esto es un error, contacta al administrador del sistema.
      </p>

      <Link
        to="/dashboard"
        className="
          flex items-center gap-2
          px-5 py-2.5 rounded-lg bg-blue-600 text-white 
          hover:bg-blue-700 transition shadow
        "
      >
        <ArrowLeft size={18} />
        Volver al panel
      </Link>
    </div>
  );
}
