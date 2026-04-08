import { Wrench, RefreshCw } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-300 to-gray-500 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl border border-gray-200">

        {/* Logo destacado */}
        <div className="mb-8 flex justify-center">
          <img
            src="https://www.delfingroupco.com/wp-content/uploads/2025/06/Delfin_Mayo2025.png"
            alt="Delfin Logo"
            className="h-20 object-contain drop-shadow-lg"
          />
        </div>

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 shadow-inner">
          <Wrench size={40} className="text-blue-600 animate-wrench" />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-semibold text-gray-800">
          Mantenimiento en curso
        </h1>

        {/* Message */}
        <p className="mb-6 text-gray-600 leading-relaxed">
          El sistema se encuentra temporalmente fuera de servicio debido a
          trabajos de mantenimiento y mejoras internas.
          <br />
          <br />
          Por favor, intenta acceder nuevamente en unos minutos.
        </p>


        {/* Footer */}
        <div className="mt-8 border-t pt-4 text-sm text-gray-500">
          Departamento de Informatica 
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes wrench {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(10deg); }
          70% { transform: rotate(-8deg); }
          100% { transform: rotate(0deg); }
        }

        .animate-wrench {
          animation: wrench 2.2s ease-in-out infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spinSlow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
