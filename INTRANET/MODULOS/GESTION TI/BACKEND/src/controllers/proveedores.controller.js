const createCrudController = require("./factory/crud.controller");
const map = require("../mappings/proveedores.map");

module.exports = createCrudController({
  spName: "dbo.SP_GA_Proveedores",
  entityName: "Proveedor",
  ...map,
});