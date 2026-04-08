import { useEffect, useState } from "react";

const ENV = import.meta.env.VITE_ENV || "LOCAL";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [versionInfo, setVersionInfo] = useState({
    version: "unknown",
    env: ENV,
    date: "-",
  });

  const mockApi = {
    getUsers: () => {
      if (ENV === "PROD") {
        return Promise.resolve([
          { id: 1, name: "Usuario Productivo", role: "Admin" },
        ]);
      }

      return Promise.resolve([
        { id: 1, name: "QA Tester", role: "Admin" },
        { id: 2, name: "Usuario Prueba", role: "User" },
      ]);
    },
  };

  useEffect(() => {
    // datos
    mockApi
      .getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error cargando datos");
        setLoading(false);
      });

    // versión
    fetch("/version.json")
      .then((res) => res.json())
      .then((data) => setVersionInfo(data))
      .catch(() => {
        setVersionInfo({ version: "dev", env: ENV, date: "local" });
      });
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Demo CI/CD - IIS Simulation</h1>

      <div style={{ marginBottom: 20 }}>
        <p><strong>Entorno:</strong> {versionInfo.env}</p>
        <p><strong>Versión:</strong> {versionInfo.version}</p>
        <p><strong>Fecha:</strong> {versionInfo.date}</p>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div>
          <h2>Usuarios</h2>
          {users.map((user) => (
            <div key={user.id}>
              {user.name} - {user.role}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          padding: "8px 12px",
          background: ENV === "PROD" ? "#dc2626" : "#2563eb",
          color: "white",
          borderRadius: 8,
        }}
      >
        {ENV}
      </div>
    </div>
  );
}