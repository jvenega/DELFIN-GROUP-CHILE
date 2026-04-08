const { sql, getPool } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function ejecutarSPMovimientos({
  id_estado,
  fecha_asignado,
  rut_persona,
  id_sucursal,
  serie,
  responsable,
  observacion,
}) {
  try {
    const pool = getPool();

    const request = pool.request();

    request.input("ID_Estado", sql.Int, id_estado ?? null);
    request.input("Fecha_Asignado", sql.DateTime, fecha_asignado ?? null);
    request.input("Rut_Persona", sql.VarChar(50), rut_persona ?? null);
    request.input("ID_Sucursal", sql.Int, id_sucursal ?? null);
    request.input("Serie", sql.VarChar(150), serie ?? null);
    request.input("Responsable", sql.VarChar(100), responsable ?? null);
    request.input("Observacion", sql.VarChar(500), observacion ?? null);

    const result = await request.execute("dbo.SP_GA_Movimientos");

    return result.recordset || [];

  } catch (error) {
    console.error("SQL ERROR MOVIMIENTOS:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error en SP_GA_Movimientos", {
      code: error.code,
      message: error.message,
    });
  }
}
async function getAllMovimientos() {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT 
        m.ID_Movimiento,
        m.Fecha_movimiento,

        -- ARTICULO
        a.Serie,

        -- ESTADO
        e.ID_Estado,
        e.Glosa_Estado,

        -- PERSONA (NOMBRE COMPUESTO)
        p.RUT AS Rut_Persona,
        CONCAT(
          p.Nombre, ' ',
          p.ApePaterno, ' ',
          p.ApeMaterno
        ) AS Nombre_Persona,

        -- SUCURSAL
        m.ID_Sucursal,
        s.Nombre_Sucursal,

        -- OTROS
        m.Responsable,
        m.Observacion

      FROM TB_Activos_Movimientos m

      -- ARTICULO
      LEFT JOIN TB_Activos_Articulos a
        ON a.Serie = m.Serie

      -- ESTADO
      LEFT JOIN TB_Activos_Estados e
        ON e.ID_Estado = m.ID_Estado

      -- PERSONAS RRHH
      LEFT JOIN TBL_RRHH_PERSONAS p
        ON p.RUT = m.Rut_Persona

      -- SUCURSAL
      LEFT JOIN TB_Activos_Sucursales s
        ON m.ID_Sucursal = s.ID_Sucursal

      ORDER BY m.Fecha_movimiento DESC
    `);

    return {
      ok: true,
      total: result.recordset.length,
      data: result.recordset || [],
    };

  } catch (error) {
    console.error("SQL ERROR Listar Movimientos:", {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, "Error al listar movimientos", {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  ejecutarSPMovimientos,
  getAllMovimientos
};


