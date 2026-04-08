import { useState } from "react";
import { login } from "../api/sapService";
import { saveSession } from "../utils/session";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    CompanyDB: "",
    UserName: "",
    Password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("FORM DATA:", form);

    try {
      const data = await login(form);
      console.log("SESSION RECIBIDA:", data);

      saveSession(data);
      onLogin(data.SessionId);
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError("Credenciales inválidas o error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login SAP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="CompanyDB"
            placeholder="CompanyDB"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="UserName"
            placeholder="Usuario"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="Password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}