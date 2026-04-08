import { ChevronRight } from "lucide-react";
import { LazyMotion, m, domAnimation } from "framer-motion";
import { LayoutConfig } from "@core/config/styles/layout";

export default function SidebarHeader({ collapsed, onToggle }) {

  const { header } = LayoutConfig.sidebar;

  const logoSrc = collapsed
    ? header.logoMini
    : header.logoFull;

  return (
    <LazyMotion features={domAnimation}>

      <div className={header.container}>

        <m.img
          key={logoSrc}
          src={logoSrc}
          alt="Delfin Group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className={`
            ${header.logoBase}
            ${collapsed ? header.logoCollapsed : header.logoExpanded}
          `}
        />

        <m.button
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Expandir menú lateral"
              : "Colapsar menú lateral"
          }
          aria-expanded={!collapsed}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={header.toggleButton}
        >

          <m.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.25 }}
          >

            <ChevronRight
              size={header.toggleIconSize}
              className={header.toggleIconColor ?? "text-white"}
            />

          </m.div>

        </m.button>

      </div>

    </LazyMotion>
  );
}