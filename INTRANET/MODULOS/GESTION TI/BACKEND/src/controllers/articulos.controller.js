const articulosService = require("../services/articulos.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// GET (con filtros)
exports.getArticulos = asyncHandler(async (req, res) => {
  const { id_marca, id_tipo } = req.query;

  const data = await articulosService.ejecutarSPArticulos({
    accion: 1,
    id_marca: id_marca ? parseInt(id_marca) : null,
    id_tipo: id_tipo ? parseInt(id_tipo) : null,
  });

  res.json({ ok: true, data });
});

// POST
exports.createArticulo = asyncHandler(async (req, res) => {
  const {
    serie,
    id_marca,
    id_modelo,
    id_tipo,
    factura,
    valor_unitario,
    rut_proveedor,
    fecha_compra,
    fecha_garantia,
  } = req.body;

  if (!serie || !id_marca || !id_modelo) {
    throw new ApiError(400, "Serie, Marca y Modelo son obligatorios");
  }

  const data = await articulosService.ejecutarSPArticulos({
    accion: 2,
    serie: parseInt(serie),
    id_marca: parseInt(id_marca),
    id_modelo: parseInt(id_modelo),
    id_tipo: id_tipo ? parseInt(id_tipo) : null,
    factura,
    valor_unitario: valor_unitario ? parseInt(valor_unitario) : null,
    rut_proveedor,
    fecha_compra,
    fecha_garantia,
  });

  res.status(201).json({
    ok: true,
    message: "Artículo creado",
    data,
  });
});

// PUT
exports.updateArticulo = asyncHandler(async (req, res) => {
  const { serie } = req.params;

  if (!serie) {
    throw new ApiError(400, "Serie requerida");
  }

  const data = await articulosService.ejecutarSPArticulos({
    accion: 3,
    serie: parseInt(serie),
    ...req.body,
  });

  res.json({
    ok: true,
    message: "Artículo actualizado",
    data,
  });
});

exports.getArticuloBySerie = asyncHandler(async (req, res) => {
  const { serie } = req.params;
  if (!serie) {
    throw new ApiError(400, "Serie requerida");
  }
  const data = await articulosService.ejecutarSPArticulos({
    accion: 4,
    serie: parseInt(serie),
  });

  if (!data || data.length === 0) {
    return res.status(404).json({
      ok: false,
      message: "Artículo no encontrado",
      data: null,
    });
  }

  res.json({
    ok: true,
    data: data[0],
  });
});