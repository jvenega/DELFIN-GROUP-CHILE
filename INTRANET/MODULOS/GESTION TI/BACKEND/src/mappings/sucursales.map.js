const { sql } = require("../services/spExecutor");
const ApiError = require("../utils/ApiError");

function validateCreate(req) {
  if (!req.body.nombre) {
    throw new ApiError(400, "Nombre es requerido");
  }
}

function validateUpdate(req) {
  if (!req.body.nombre) {
    throw new ApiError(400, "Nombre es requerido");
  }
}

function buildListParams() {
  return [
    { name: "ACCION", type: sql.Int, value: 1 },
    { name: "ID_Sucursal", type: sql.Int, value: null },
    { name: "Nombre_Sucursal", type: sql.VarChar(150), value: null },
    { name: "Descripcion", type: sql.VarChar(250), value: null },
  ];
}

function buildCreateParams(req) {
  const { nombre, descripcion } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 2 },
    { name: "ID_Sucursal", type: sql.Int, value: null },
    { name: "Nombre_Sucursal", type: sql.VarChar(150), value: nombre },
    { name: "Descripcion", type: sql.VarChar(250), value: descripcion },
  ];
}

function buildUpdateParams(req) {
  const { nombre, descripcion } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 3 },
    { name: "ID_Sucursal", type: sql.Int, value: parseInt(req.params.id, 10) },
    { name: "Nombre_Sucursal", type: sql.VarChar(150), value: nombre },
    { name: "Descripcion", type: sql.VarChar(250), value: descripcion },
  ];
}

module.exports = {
  validateCreate,
  validateUpdate,
  buildListParams,
  buildCreateParams,
  buildUpdateParams,
};