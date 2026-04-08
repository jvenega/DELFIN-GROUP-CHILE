const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPModelos({
  accion,
  id_modelo,
  glosa,
  clase,
  descripcion,
}) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("ID_Modelo", sql.Int, id_modelo ?? null);
    request.input("Glosa_Modelo", sql.VarChar(250), glosa ?? null);
    request.input("Clase_Modelo", sql.VarChar(50), clase ?? null);
    request.input("Descripcion_Modelo", sql.VarChar(250), descripcion ?? null);

    const result = await request.execute("dbo.SP_GA_Modelos");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR MODELOS:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Modelos", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPModelos,
};