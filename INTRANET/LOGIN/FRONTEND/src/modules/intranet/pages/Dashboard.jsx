/* eslint-disable no-unused-vars */
import { useRef } from "react";

import {
  LazyMotion,
  m,
  domAnimation,
  useScroll,
  useTransform
} from "framer-motion";

import { ArrowBigLeftDash } from "lucide-react";

import DelfinDash from "../../../components/assets/delfin-dashboard.jpg";
import svgwelcome from "../assets/undraw_hello_ccwj.svg";

/* ============================================================
   Banner
============================================================ */

function DashboardBanner() {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const height = useTransform(scrollY, [0, 120], [140, 85]);
  const imageOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const textOpacity = useTransform(scrollY, [0, 60], [1, 0]);

  return (
    <m.div
      ref={ref}
      style={{ height }}
      className="
        relative
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        shadow-sm
      "
    >
      <div
        className="
          absolute inset-0
          bg-linear-to-r
          from-blue-900
          via-blue-700
          to-cyan-600
        "
      />

      <m.img
        src={DelfinDash}
        alt="Delfin Group Chile"
        style={{ opacity: imageOpacity }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <m.div
        style={{ opacity: textOpacity }}
        className="
          absolute inset-0
          flex items-center
          px-6 md:px-10
        "
      >
        <div className="max-w-lg text-white">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">
            Delfin Group Chile
          </h1>

          <p className="text-sm text-white/85 mt-1">
            Plataforma Corporativa · Gestión Operacional
          </p>

          <p className="text-xs text-white/70 mt-2">
            Conectando Asia y Latinoamérica mediante soluciones logísticas integrales
          </p>
        </div>
      </m.div>
    </m.div>
  );
}

/* ============================================================
   Empty State
============================================================ */

function DashboardEmptyState({ sidebarCollapsed }) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-6 text-center">

      <div className="max-w-xs mb-6">
        <img
          src={svgwelcome}
          alt="Bienvenida"
          className="w-full object-contain"
        />
      </div>

      <h1 className="text-xl font-semibold text-gray-800 mb-2">
        Bienvenido al sistema
      </h1>

      <p className="text-gray-600 max-w-md mb-5 text-sm">
        Accede a los módulos disponibles según tu perfil desde el menú lateral.
      </p>

      {!sidebarCollapsed ? (
        <m.div
          key="expanded"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex items-center gap-2 text-blue-600"
        >
          <ArrowBigLeftDash className="w-5 h-5 animate-[pulse_1.5s_ease-in-out_infinite]" />
          <span className="text-sm font-medium">
            Selecciona un módulo desde el menú
          </span>
        </m.div>
      ) : (
        <m.div
          key="collapsed"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex items-center gap-2 text-blue-600"
        >
          <span className="text-sm font-medium">
            Expande el menú para ver los módulos ☰
          </span>
        </m.div>
      )}

    </div>
  );
}

/* ============================================================
   Dashboard
============================================================ */

export default function Dashboard({ sidebarCollapsed = false }) {
  const scrollRef = useRef(null);

  const { scrollY } = useScroll({
    container: scrollRef
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={scrollRef}
        className="
          space-y-6
          overflow-y-auto
          h-full
          pr-1
        "
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <DashboardBanner scrollY={scrollY} />

        <m.div
          className="
            bg-white
            border
            rounded-xl
            shadow-sm
            p-6
            min-h-[50vh]
            flex
            items-center
            justify-center
          "
        >
          <DashboardEmptyState sidebarCollapsed={sidebarCollapsed} />
        </m.div>
      </m.div>
    </LazyMotion>
  );
}