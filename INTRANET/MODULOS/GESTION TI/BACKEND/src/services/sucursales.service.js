const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPSucursales({
  accion,
  id_sucursal,
  nombre,
  descripcion,
}) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("ID_Sucursal", sql.Int, id_sucursal ?? null);
    request.input("Nombre_Sucursal", sql.VarChar(150), nombre ?? null);
    request.input("Descripcion", sql.VarChar(250), descripcion ?? null);

    const result = await request.execute("dbo.SP_GA_Sucursales");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR SUCURSALES:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Sucursales", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPSucursales,
};