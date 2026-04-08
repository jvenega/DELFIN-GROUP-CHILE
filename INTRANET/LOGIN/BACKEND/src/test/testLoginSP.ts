  import { getConnection } from "../config/db";

  const testLoginSP = async () => {
    const pool = await getConnection();

    const usuario = "RLOPEZ@DELFINORIENTE.CL"; // ejemplo
    const clave = "Delta2025";

    try {
      console.log("✅ Conectado a SQL Server");
      console.log("=== Probando SP_SEG_LoginUsuario ===");

      const result = await pool.request()
        .input("USUARIO", usuario)
        .input("CLAVE", clave)
        .execute("SP_SEG_LoginUsuario");

      console.log("Resultado bruto:", result.recordset);
      console.log("Estado devuelto:", result.recordset[0]?.Estado || result.recordset[0]);

    } catch (error) {
      console.error("Error al ejecutar SP_SEG_LoginUsuario:", error);
    } finally {
      pool.close();
    }
  };

  testLoginSP();
