/* eslint-disable no-unused-vars */
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";

export default function LoadingOverlay({
  open = true,
  text = "Procesando...",
  subtext = "",
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            className="
              fixed inset-0 z-9999
              flex items-center justify-center
              bg-black/70 backdrop-blur-md
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* CARD */}
            <m.div
              className="
                flex flex-col items-center text-center
                gap-4
                px-8 py-7
                rounded-2xl
                bg-white/95 backdrop-blur
                shadow-2xl
                w-[90%] max-w-sm
              "
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* ICON CON SPINNER */}
              <div className="relative flex items-center justify-center">
                
                {/* ICONO CENTRAL */}
                <ShieldCheck size={42} className="text-blue-600" />

                {/* SPINNER SUPERPUESTO */}
                <Loader2
                  size={64}
                  className="absolute animate-spin text-blue-400 opacity-70"
                />

              </div>

              {/* TEXT */}
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold text-slate-800">
                  {text}
                </span>

                {subtext && (
                  <span className="text-sm text-slate-500 mt-1">
                    {subtext}
                  </span>
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}