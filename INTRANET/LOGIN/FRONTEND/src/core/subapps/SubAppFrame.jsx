import { useEffect, useRef } from "react";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

import { useSubAppHealth } from "./useSubAppHealth";

import CheckingStatus from "./CheckingStatus";
import ServiceUnavailable from "./ServiceUnavailable";

export default function SubAppFrame({
  src,
  debug = false,
  skipHealthCheck = false
}) {
  const containerRef = useRef(null);

  const { status, checkService } = useSubAppHealth({
    src,
    skipHealthCheck
  });

  useEffect(() => {
    if (status !== "ready") return;

    const container = containerRef.current;
    if (!container) return;

    // 🔴 FIX: crear iframe limpio SIEMPRE
    const iframe = document.createElement("iframe");

    iframe.src = src;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Opcional debug
    if (debug) {
      console.log("Loading iframe:", src);
    }

    // limpiar y montar
    container.replaceChildren(iframe);

  }, [status, src, debug]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full h-full relative">

        <AnimatePresence mode="wait">
          {status === "checking" && <CheckingStatus />}
          {status === "error" && (
            <ServiceUnavailable
              src={src}
              onRetry={checkService}
            />
          )}
        </AnimatePresence>

        <div
          ref={containerRef}
          className={status === "ready" ? "w-full h-full" : "hidden"}
        />

      </div>
    </LazyMotion>
  );
}