const createCrudController = require("./factory/crud.controller");
const map = require("../mappings/estados.map");

module.exports = createCrudController({
  spName: "dbo.SP_GA_Estados",
  entityName: "Estado",
  ...map,
});