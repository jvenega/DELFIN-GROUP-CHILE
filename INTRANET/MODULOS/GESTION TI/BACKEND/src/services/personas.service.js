const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPPersonas({
  accion,
  rut,
  nombre,
  ape_paterno,
  ape_materno,
  cargo,
  area,
  sucursal,
  fec_ingreso,
  fecha_cese,
  rut_jefe,
  estado,
  id_usuario,
}) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("RUT", sql.VarChar(50), rut ?? null);
    request.input("Nombre", sql.VarChar(100), nombre ?? null);
    request.input("ApePaterno", sql.VarChar(100), ape_paterno ?? null);
    request.input("ApeMaterno", sql.VarChar(100), ape_materno ?? null);
    request.input("Cargo", sql.VarChar(150), cargo ?? null);
    request.input("Area", sql.VarChar(150), area ?? null);
    request.input("Sucursal", sql.Int, sucursal ?? null);
    request.input("FecIngreso", sql.Date, fec_ingreso ?? null);
    request.input("Fecha_Cese", sql.Date, fecha_cese ?? null);
    request.input("RutJefe", sql.VarChar(50), rut_jefe ?? null);
    request.input("ESTADO", sql.VarChar(50), estado ?? null);
    request.input("IDUsuario", sql.Int, id_usuario ?? null);

    const result = await request.execute("dbo.SP_GA_PERSONAS");

    return result.recordset || [];

  } catch (error) {
    console.error("SQL ERROR PERSONAS:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_PERSONAS", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPPersonas,
};