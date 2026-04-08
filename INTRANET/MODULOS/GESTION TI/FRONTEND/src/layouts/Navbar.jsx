import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Estados", path: "/estados" },
    { name: "Marcas", path: "/marcas" },
    { name: "Modelo", path: "/modelo" },
    { name: "Proveedores", path: "/proveedores" },
    { name: "Tipos", path: "/tipos" },
    { name: "Movimientos", path: "/movimientos" },
    { name: "Artículos", path: "/articulos" },
  ];

  return (
    <nav className="w-full bg-slate-200 border-b border-slate-200 fixed top-0 z-10">
      <div className="w-full px-4">
        <div className="flex items-end h-14">
          <div className="flex space-x-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-t-md border border-b-0
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-gray-900 border-gray-300 border-b-white"
                        : "bg-slate-200 text-gray-700 border-slate-300 hover:bg-slate-300 hover:text-gray-900"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
