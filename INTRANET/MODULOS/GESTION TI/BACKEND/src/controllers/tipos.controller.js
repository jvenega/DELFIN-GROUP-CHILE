const createCrudController = require("./factory/crud.controller");
const map = require("../mappings/tipos.map");

module.exports = createCrudController({
  spName: "dbo.SP_GA_Tipos",
  entityName: "Tipo",
  ...map,
});