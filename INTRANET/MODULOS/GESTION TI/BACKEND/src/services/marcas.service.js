const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPMarcas({ accion, id_marca, glosa }) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("ID_Marca", sql.Int, id_marca ?? null);
    request.input("Glosa_Marca", sql.VarChar(150), glosa ?? null);

    const result = await request.execute("dbo.SP_GA_Marcas");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR MARCAS:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Marcas", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPMarcas,
};