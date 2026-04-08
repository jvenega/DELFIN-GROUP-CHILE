const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPTipos({ accion, id_tipo, glosa }) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("ID_Tipo", sql.Int, id_tipo ?? null);
    request.input("Glosa_Tipo", sql.VarChar(150), glosa ?? null);

    const result = await request.execute("dbo.SP_GA_Tipos");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR TIPOS:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Tipos", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPTipos,
};