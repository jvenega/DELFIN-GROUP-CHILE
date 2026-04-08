import { CheckCircle2 } from "lucide-react";

export default function SuccessStep({ navigate }) {

  return (
    <div className="text-center">

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 animate-pulse">
        <CheckCircle2 size={36} className="text-emerald-400" />
      </div>

      <h2 className="text-2xl font-semibold text-emerald-400 mb-2">
        ¡Contraseña actualizada!
      </h2>

      <button
        onClick={() => navigate("/login", { replace: true })}
        className="w-full rounded-xl py-3 font-semibold bg-blue-600 hover:bg-blue-700 transition"
      >
        Ir al inicio de sesión ahora
      </button>

    </div>
  );
}