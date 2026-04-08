const { sql } = require("../services/spExecutor");
const ApiError = require("../utils/ApiError");

function validateCreate(req) {
  const { rut, nombre } = req.body;
  if (!rut || !nombre) {
    throw new ApiError(400, "Rut y Nombre son obligatorios");
  }
}

function validateUpdate(req) {
  if (!req.params.id) {
    throw new ApiError(400, "Rut requerido");
  }
}

function buildListParams() {
  return [
    { name: "ACCION", type: sql.Int, value: 1 },
    { name: "Rut_Proveedor", type: sql.VarChar(50), value: null },
    { name: "Nombre_Proveedor", type: sql.VarChar(250), value: null },
    { name: "Persona_Contacto", type: sql.VarChar(250), value: null },
    { name: "Correo_Contacto", type: sql.VarChar(250), value: null },
    { name: "Celular_Contacto", type: sql.VarChar(250), value: null },
    { name: "Servicios_Prestados", type: sql.VarChar(500), value: null },
  ];
}

function buildCreateParams(req) {
  const { rut, nombre, contacto, correo, celular, servicios } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 2 },
    { name: "Rut_Proveedor", type: sql.VarChar(50), value: rut },
    { name: "Nombre_Proveedor", type: sql.VarChar(250), value: nombre },
    { name: "Persona_Contacto", type: sql.VarChar(250), value: contacto },
    { name: "Correo_Contacto", type: sql.VarChar(250), value: correo },
    { name: "Celular_Contacto", type: sql.VarChar(250), value: celular },
    { name: "Servicios_Prestados", type: sql.VarChar(500), value: servicios },
  ];
}

function buildUpdateParams(req) {
  const { nombre, contacto, correo, celular, servicios } = req.body;

  return [
    { name: "ACCION", type: sql.Int, value: 3 },
    { name: "Rut_Proveedor", type: sql.VarChar(50), value: req.params.id },
    { name: "Nombre_Proveedor", type: sql.VarChar(250), value: nombre },
    { name: "Persona_Contacto", type: sql.VarChar(250), value: contacto },
    { name: "Correo_Contacto", type: sql.VarChar(250), value: correo },
    { name: "Celular_Contacto", type: sql.VarChar(250), value: celular },
    { name: "Servicios_Prestados", type: sql.VarChar(500), value: servicios },
  ];
}

module.exports = {
  validateCreate,
  validateUpdate,
  buildListParams,
  buildCreateParams,
  buildUpdateParams,
};