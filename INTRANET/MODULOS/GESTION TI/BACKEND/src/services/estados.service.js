const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSP({ accion, id_estado, glosa, descripcion }) {
  try {
    const pool = getPool(); // ✅ correcto

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("ID_Estado", sql.Int, id_estado ?? null);
    request.input("Glosa_Estado", sql.VarChar(150), glosa ?? null);
    request.input("Descripcion", sql.VarChar(250), descripcion ?? null);

    const result = await request.execute("dbo.SP_GA_Estados");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR DETECTADO:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error interno en base de datos", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSP,
};