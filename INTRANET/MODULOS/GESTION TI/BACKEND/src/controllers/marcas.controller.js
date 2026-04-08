const createCrudController = require("./factory/crud.controller");
const map = require("../mappings/marcas.map");

module.exports = createCrudController({
  spName: "dbo.SP_GA_Marcas",
  entityName: "Marca",
  ...map,
});