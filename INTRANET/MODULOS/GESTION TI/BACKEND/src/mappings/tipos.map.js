const { sql } = require("../services/spExecutor");
const ApiError = require("../utils/ApiError");

function validateCreate(req) {
  if (!req.body.glosa) {
    throw new ApiError(400, "Glosa es requerida");
  }
}

function validateUpdate(req) {
  if (!req.body.glosa) {
    throw new ApiError(400, "Glosa es requerida");
  }
}

function buildListParams() {
  return [
    { name: "ACCION", type: sql.Int, value: 1 },
    { name: "ID_Tipo", type: sql.Int, value: null },
    { name: "Glosa_Tipo", type: sql.VarChar(150), value: null },
  ];
}

function buildCreateParams(req) {
  return [
    { name: "ACCION", type: sql.Int, value: 2 },
    { name: "ID_Tipo", type: sql.Int, value: null },
    { name: "Glosa_Tipo", type: sql.VarChar(150), value: req.body.glosa },
  ];
}

function buildUpdateParams(req) {
  return [
    { name: "ACCION", type: sql.Int, value: 3 },
    { name: "ID_Tipo", type: sql.Int, value: parseInt(req.params.id, 10) },
    { name: "Glosa_Tipo", type: sql.VarChar(150), value: req.body.glosa },
  ];
}

module.exports = {
  validateCreate,
  validateUpdate,
  buildListParams,
  buildCreateParams,
  buildUpdateParams,
};