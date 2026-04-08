import { Search } from "lucide-react";
import TopbarBreadcrumbs from "../components/Topbar/TopbarBreadcrumbs";
import TopbarActions from "../components/Topbar/TopbarActions";
import { LayoutConfig } from "@core/config/styles/layout";
import "@core/styles/layout.tailwind.css";

export default function Topbar() {

  const { topbar } = LayoutConfig;
  const { actions } = topbar;

  return (
    <header
      className={`
        ${topbar.height}
        ${topbar.bg}
        ${topbar.border}
        ${topbar.container}
      `}
    >

      {/* LEFT */}
      <div className="flex items-center min-w-65">
        <TopbarBreadcrumbs />
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center">

        <div className={actions.search.wrapper}>

          <Search
            size={actions.search.icon.size}
            className={actions.search.icon.className}
          />

          <input
            placeholder={actions.search.placeholder}
            className={actions.search.input}
          />

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <TopbarActions />
      </div>

    </header>
  );
}