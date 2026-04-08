const { sql } = require("../services/spExecutor");
const ApiError = require("../utils/ApiError");

function validateCreate(req) {
  const { glosa } = req.body;
  if (!glosa) {
    throw new ApiError(400, "Glosa es requerida");
  }
}

function validateUpdate(req) {
  const { glosa } = req.body;
  if (!glosa) {
    throw new ApiError(400, "Glosa es requerida");
  }
}

function buildListParams() {
  return [
    { name: "ACCION", type: sql.Int, value: 1 },
    { name: "ID_Estado", type: sql.Int, value: null },
    { name: "Glosa_Estado", type: sql.VarChar(150), value: null },
    { name: "Descripcion", type: sql.VarChar(250), value: null },
  ];
}

function buildCreateParams(req) {
  const { glosa, descripcion } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 2 },
    { name: "ID_Estado", type: sql.Int, value: null },
    { name: "Glosa_Estado", type: sql.VarChar(150), value: glosa },
    { name: "Descripcion", type: sql.VarChar(250), value: descripcion },
  ];
}

function buildUpdateParams(req) {
  const { id } = req.params;
  const { glosa, descripcion } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 3 },
    { name: "ID_Estado", type: sql.Int, value: parseInt(id, 10) },
    { name: "Glosa_Estado", type: sql.VarChar(150), value: glosa },
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