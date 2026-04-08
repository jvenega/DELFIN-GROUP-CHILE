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
    { name: "ID_Modelo", type: sql.Int, value: null },
    { name: "Glosa_Modelo", type: sql.VarChar(250), value: null },
    { name: "Clase_Modelo", type: sql.VarChar(50), value: null },
    { name: "Descripcion_Modelo", type: sql.VarChar(250), value: null },
  ];
}

function buildCreateParams(req) {
  const { glosa, clase, descripcion } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 2 },
    { name: "ID_Modelo", type: sql.Int, value: null },
    { name: "Glosa_Modelo", type: sql.VarChar(250), value: glosa },
    { name: "Clase_Modelo", type: sql.VarChar(50), value: clase },
    { name: "Descripcion_Modelo", type: sql.VarChar(250), value: descripcion },
  ];
}

function buildUpdateParams(req) {
  const { glosa, clase, descripcion } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 3 },
    { name: "ID_Modelo", type: sql.Int, value: parseInt(req.params.id, 10) },
    { name: "Glosa_Modelo", type: sql.VarChar(250), value: glosa },
    { name: "Clase_Modelo", type: sql.VarChar(50), value: clase },
    { name: "Descripcion_Modelo", type: sql.VarChar(250), value: descripcion },
  ];
}

module.exports = {
  validateCreate,
  validateUpdate,
  buildListParams,
  buildCreateParams,
  buildUpdateParams,
};