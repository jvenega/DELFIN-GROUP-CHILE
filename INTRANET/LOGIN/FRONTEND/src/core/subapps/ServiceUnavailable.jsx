/* eslint-disable no-unused-vars */
import { m } from "framer-motion";
import { useMemo } from "react";

export default function ServiceUnavailable({ onRetry, src }) {

  const host = useMemo(() => {
    try {
      return new URL(src).hostname;
    } catch {
      return null;
    }
  }, [src]);

  return (
    <m.div
      className="absolute inset-0 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full text-center px-6">

        {/* Icon */}
        <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
          ⚠
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          No pudimos abrir este módulo
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          El servicio asociado a este módulo no está disponible en este momento.
        </p>

        {/* Host */}
        {host && (
          <p className="text-xs text-gray-400 mb-6">
            Servicio: <span className="font-mono">{host}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">

          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Reintentar
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 transition"
          >
            Recargar página
          </button>

        </div>
      </div>
    </m.div>
  );
}