const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPArticulos({
  accion,
  serie,
  id_marca,
  id_modelo,
  id_tipo,
  factura,
  valor_unitario,
  rut_proveedor,
  fecha_compra,
  fecha_garantia,
}) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ACCION", sql.Int, accion);
    request.input("Serie", sql.Int, serie ?? null);
    request.input("ID_Marca", sql.Int, id_marca ?? null);
    request.input("ID_Modelo", sql.Int, id_modelo ?? null);
    request.input("ID_Tipo", sql.Int, id_tipo ?? null);
    request.input("Factura", sql.VarChar(150), factura ?? null);
    request.input("Valor_Unitario", sql.Int, valor_unitario ?? null);
    request.input("Rut_Proveedor", sql.VarChar(50), rut_proveedor ?? null);
    request.input("Fecha_compra", sql.Date, fecha_compra ?? null);
    request.input("Fecha_Venc_Garantia", sql.Date, fecha_garantia ?? null);

    const result = await request.execute("dbo.SP_GA_Articulos");

    return result.recordset;

  } catch (error) {
    console.error("SQL ERROR ARTICULOS:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Articulos", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPArticulos,
};