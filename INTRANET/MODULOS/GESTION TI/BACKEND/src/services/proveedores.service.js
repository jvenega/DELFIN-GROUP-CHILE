const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPProveedores({
  accion,
  rut,
  nombre,
  contacto,
  correo,
  celular,
  servicios,
}) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("Rut_Proveedor", sql.VarChar(50), rut ?? null);
    request.input("Nombre_Proveedor", sql.VarChar(250), nombre ?? null);
    request.input("Persona_Contacto", sql.VarChar(250), contacto ?? null);
    request.input("Correo_Contacto", sql.VarChar(250), correo ?? null);
    request.input("Celular_Contacto", sql.VarChar(250), celular ?? null);
    request.input("Servicios_Prestados", sql.VarChar(500), servicios ?? null);

    const result = await request.execute("dbo.SP_GA_Proveedores");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR PROVEEDORES:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Proveedores", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPProveedores,
};