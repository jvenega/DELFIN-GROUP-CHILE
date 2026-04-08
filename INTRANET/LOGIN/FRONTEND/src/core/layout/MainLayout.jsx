import { memo } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@context/Auth/useAuth";

// UI
import Sidebar from "./container/Sidebar";
import Topbar from "./container/Topbar";

// Skeletons
import SidebarSkeleton from "./components/Sidebar/SidebarSkeleton";
import TopbarSkeleton from "./components/Topbar/TopbarSkeleton";

// Layout
import { LayoutConfig } from "@core/config/styles/layout";

// Styles
import "@core/styles/layout.tailwind.css";

function MainLayoutBase() {

  const { loadingUser } = useAuth();

  const { shell } = LayoutConfig;

  return (

    <div className={`main-wrapper ${shell.page}`}>

      {/* SIDEBAR */}
      {loadingUser ? <SidebarSkeleton /> : <Sidebar />}

      <div className="main-content">

        {/* TOPBAR */}
        {loadingUser ? <TopbarSkeleton /> : <Topbar />}

        {/* CONTENT */}
        <main className={`content-area ${shell.content}`}>
          <Outlet />
        </main>

        

      </div>

    </div>

  );

}

export default memo(MainLayoutBase);