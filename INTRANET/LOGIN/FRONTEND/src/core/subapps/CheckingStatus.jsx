/* eslint-disable no-unused-vars */
import { m } from "framer-motion";

export default function CheckingStatus() {
  return (
    <m.div
      className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center gap-3 text-slate-600 text-sm">

        <m.span
          className="text-lg"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
        >
          ⏳
        </m.span>

        <span className="font-medium">
          Inicializando servicio…
        </span>

      </div>
    </m.div>
  );
}