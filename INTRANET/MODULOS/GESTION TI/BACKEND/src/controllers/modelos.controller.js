const modelosService = require("../services/modelos.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// GET
exports.getModelos = asyncHandler(async (req, res) => {
  const data = await modelosService.ejecutarSPModelos({
    accion: 1,
  });

  res.json({ ok: true, data });
});

// POST
exports.createModelo = asyncHandler(async (req, res) => {
  const { glosa, clase, descripcion } = req.body;

  if (!glosa) {
    throw new ApiError(400, "Glosa es requerida");
  }

  const data = await modelosService.ejecutarSPModelos({
    accion: 2,
    glosa,
    clase,
    descripcion,
  });

  res.status(201).json({
    ok: true,
    message: "Modelo creado",
    data,
  });
});

// PUT
exports.updateModelo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { glosa, clase, descripcion } = req.body;

  if (!id) {
    throw new ApiError(400, "ID requerido");
  }

  const data = await modelosService.ejecutarSPModelos({
    accion: 3,
    id_modelo: parseInt(id),
    glosa,
    clase,
    descripcion,
  });

  res.json({
    ok: true,
    message: "Modelo actualizado",
    data,
  });
});