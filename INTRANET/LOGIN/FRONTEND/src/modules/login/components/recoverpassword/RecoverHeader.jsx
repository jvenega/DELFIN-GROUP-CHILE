import { KeyRound } from "lucide-react";
import { STEP } from "./constants";

export default function RecoverHeader({ step }) {

  return (
    <div className="mb-8 text-center">

      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15">
        <KeyRound size={26} className="text-blue-400" />
      </div>

      {step === STEP.CODE && (
        <>
          <h1 className="text-2xl font-semibold">
            Código de verificación
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ingrese el código enviado a su correo
          </p>
        </>
      )}

      {step === STEP.PASSWORD && (
        <>
          <h1 className="text-2xl font-semibold">
            Nueva contraseña
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cree su nueva contraseña segura
          </p>
        </>
      )}

      {step === STEP.SUCCESS && (
        <h1 className="text-2xl font-semibold text-emerald-400">
          Contraseña actualizada
        </h1>
      )}

    </div>
  );
}