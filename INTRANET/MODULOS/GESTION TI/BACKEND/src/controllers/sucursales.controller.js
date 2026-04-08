const createCrudController = require("./factory/crud.controller");
const map = require("../mappings/sucursales.map");

module.exports = createCrudController({
  spName: "dbo.SP_GA_Sucursales",
  entityName: "Sucursal",
  ...map,
});