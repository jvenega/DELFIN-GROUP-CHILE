import { LayoutConfig } from "@core/config/styles/layout";
import SidebarHeader from "../components/Sidebar/SidebarHeader";
import SidebarNav from "../components/Sidebar/SidebarNav";
import SidebarFooter from "../components/Sidebar/SidebarFooter";
import { useSidebarState } from "../hooks/useSidebarState";

export default function Sidebar() {

  const { sidebar } = LayoutConfig;

  const { collapsed, toggleCollapsed } = useSidebarState();

  const widthClass = collapsed
    ? sidebar.widthCollapsed
    : sidebar.widthExpanded;

  return (

    <aside
      className={`
        relative
        flex
        flex-col
        h-full
        overflow-hidden
        transition-[width]
        duration-300
        ease-in-out
        ${sidebar.bgColor}
        ${sidebar.borderColor}
        ${widthClass}
      `}
    >

      {/* HEADER */}
      <div className="shrink-0">
        <SidebarHeader
          collapsed={collapsed}
          onToggle={toggleCollapsed}
        />
      </div>

      {/* NAVIGATION */}
      <div
        className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
        "
      >
        <SidebarNav collapsed={collapsed} />
      </div>

      {/* FOOTER */}
      <div className="shrink-0">
        <SidebarFooter collapsed={collapsed} />
      </div>

    </aside>

  );

}