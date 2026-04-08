import {  ArrowLeft, ShipWheel } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <ShipWheel
            size={70}
            className="text-blue-600 animate-compass"
          />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-semibold text-gray-800">
          Upps... Página no encontrada
        </h1>

        {/* Message */}
        <p className="mb-6 text-gray-600 leading-relaxed">
          La página que estás buscando no existe o ha sido movida.
          <br />
          <br />

        </p>

        {/* Action */}
        <Link
          to="/dashboard"
          className="
            mx-auto inline-flex items-center gap-2
            rounded-lg bg-blue-950 px-5 py-2.5
            text-white font-medium
            shadow
            hover:bg-blue-700
            transition
          "
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        {/* Footer */}
        <div className="mt-8 border-t pt-4 text-sm text-gray-400">
          Código de error: 404
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes compass {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(6deg); }
          50% { transform: rotate(-6deg); }
          75% { transform: rotate(4deg); }
          100% { transform: rotate(0deg); }
        }

        .animate-compass {
          animation: compass 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
