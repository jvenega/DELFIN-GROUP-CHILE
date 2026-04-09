import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./layouts/Navbar";

import Home from "./pages/Home";
import Estados from "./pages/Estados";
import Marcas from "./pages/Marcas";
import Modelo from "./pages/Modelos";
import Proveedores from "./pages/Proveedores";
import Tipos from "./pages/Tipos";
import Movimientos from "./pages/Movimientos";
import ArticulosPorPersona from "./pages/ArticulosPorPersona";

export default function App() {
  return (
    <Router basename="/intranet/gestion-ti">
      
      <div className="h-screen flex flex-col bg-gray-50">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENIDO */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/estados" element={<Estados />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/modelo" element={<Modelo />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/tipos" element={<Tipos />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/articulos" element={<ArticulosPorPersona />} />
          </Routes>
        </main>

      </div>

    </Router>
  );
}