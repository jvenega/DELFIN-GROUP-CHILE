import { useState } from "react";
import { getInvoice } from "../api/sapService";
import { clearSession } from "../utils/session";

export default function Dashboard({ onLogout }) {
  const [docEntry, setDocEntry] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!docEntry) {
      setError("Debe ingresar un DocEntry");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getInvoice(docEntry);
      setData(result);
    } catch (err) {
      console.log(err);
      setError("No se pudo obtener la factura");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SAP Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        
        {/* BUSCADOR */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Buscar Factura
          </h2>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="DocEntry"
              value={docEntry}
              onChange={(e) => setDocEntry(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* RESULTADO */}
        {data && (
          <>
            {/* INFO GENERAL */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Información General
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <p><b>DocEntry:</b> {data.DocEntry}</p>
                <p><b>DocNum:</b> {data.DocNum}</p>
                <p><b>Estado:</b> {data.DocumentStatus}</p>

                <p><b>Cliente:</b> {data.CardCode}</p>
                <p><b>Nombre:</b> {data.CardName}</p>

                <p><b>Fecha:</b> {data.DocDate}</p>
                <p><b>Vencimiento:</b> {data.DocDueDate}</p>

                <p><b>Moneda:</b> {data.DocCurrency}</p>
                <p><b>Total:</b> {data.DocTotal}</p>
                <p><b>Impuesto:</b> {data.VatSum}</p>

                <p><b>Vendedor:</b> {data.SalesPersonCode}</p>
                <p><b>Comentarios:</b> {data.Comments}</p>
              </div>
            </div>

            {/* DIRECCIONES */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Direcciones
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold">Facturación</h3>
                  <p>{data.Address}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Envío</h3>
                  <p>{data.Address2}</p>
                </div>
              </div>
            </div>

            {/* LÍNEAS DE DOCUMENTO */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Detalle de Productos
              </h2>

              <div className="overflow-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">ItemCode</th>
                      <th className="p-2 border">Descripción</th>
                      <th className="p-2 border">Cantidad</th>
                      <th className="p-2 border">Precio</th>
                      <th className="p-2 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.DocumentLines?.map((line, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{line.ItemCode}</td>
                        <td className="p-2 border">{line.ItemDescription}</td>
                        <td className="p-2 border">{line.Quantity}</td>
                        <td className="p-2 border">{line.Price}</td>
                        <td className="p-2 border">{line.LineTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* JSON COMPLETO */}
            <div className="bg-black text-green-400 p-4 rounded-xl text-xs overflow-auto">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}