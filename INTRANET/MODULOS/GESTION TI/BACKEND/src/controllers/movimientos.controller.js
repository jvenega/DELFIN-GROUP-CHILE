const movimientosService = require("../services/movimientos.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const e = require("express");

// POST (único endpoint)
exports.createMovimiento = asyncHandler(async (req, res) => {
  const {
    id_estado,
    fecha_asignado,
    rut_persona,
    id_sucursal,
    serie,
    responsable,
    observacion,
  } = req.body;

  // ⚠️ Validación clave según SP
  if (!rut_persona) {
    throw new ApiError(400, "Rut_Persona es obligatorio");
  }

  const data = await movimientosService.ejecutarSPMovimientos({
    id_estado,
    fecha_asignado,
    rut_persona,
    id_sucursal,
    serie,
    responsable,
    observacion,
  });

  res.status(201).json({
    ok: true,
    message: "Movimiento registrado",
    data,
  });
});

exports.AllMovimientos = asyncHandler(async (req, res) => {
  const { desde, hasta, sucursal } = req.query;

  const data = await movimientosService.getAllMovimientos({
    desde,
    hasta,
    sucursal,
  });

  if (!data || data.length === 0) {
    return res.status(200).json({
      ok: true,
      message: "Sin movimientos",
      total: 0,
      data: [],
    });
  }

  res.status(200).json({
    ok: true,
    total: data.length,
    data,
  });
});