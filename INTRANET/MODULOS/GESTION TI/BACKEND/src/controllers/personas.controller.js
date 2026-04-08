const personasService = require("../services/personas.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// GET (consulta por RUT)
exports.getPersona = asyncHandler(async (req, res) => {
  const { rut } = req.params;

  if (!rut) {
    throw new ApiError(400, "RUT requerido");
  }

  const data = await personasService.ejecutarSPPersonas({
    accion: 1,
    rut,
  });

  res.json({ ok: true, data });
});

// POST (upsert)
exports.upsertPersona = asyncHandler(async (req, res) => {
  const {
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
  } = req.body;

  if (!rut || !nombre) {
    throw new ApiError(400, "RUT y Nombre son obligatorios");
  }

  const data = await personasService.ejecutarSPPersonas({
    accion: 0,
    rut,
    nombre,
    ape_paterno,
    ape_materno,
    cargo,
    area,
    sucursal: sucursal ? parseInt(sucursal) : null,
    fec_ingreso,
    fecha_cese,
    rut_jefe,
    estado,
    id_usuario: id_usuario ? parseInt(id_usuario) : null,
  });

  res.status(200).json({
    ok: true,
    message: "Persona registrada/actualizada",
    data,
  });
});