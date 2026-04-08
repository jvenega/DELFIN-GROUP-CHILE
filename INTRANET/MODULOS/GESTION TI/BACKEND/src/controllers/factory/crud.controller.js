const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const { executeSP } = require("../../services/spExecutor");

function createCrudController({
  spName,
  buildListParams,
  buildCreateParams,
  buildUpdateParams,
  entityName,
  validateCreate,
  validateUpdate,
}) {
  const getAll = asyncHandler(async (req, res) => {
    const params = buildListParams(req);
    const data = await executeSP(spName, params);

    res.json({
      ok: true,
      data,
    });
  });

  const create = asyncHandler(async (req, res) => {
    if (validateCreate) {
      validateCreate(req);
    }

    const params = buildCreateParams(req);
    const data = await executeSP(spName, params);

    res.status(201).json({
      ok: true,
      message: `${entityName} creado`,
      data,
    });
  });

  const update = asyncHandler(async (req, res) => {
    if (!req.params.id) {
      throw new ApiError(400, "ID requerido");
    }

    if (validateUpdate) {
      validateUpdate(req);
    }

    const params = buildUpdateParams(req);
    const data = await executeSP(spName, params);

    res.json({
      ok: true,
      message: `${entityName} actualizado`,
      data,
    });
  });

  return {
    getAll,
    create,
    update,
  };
}

module.exports = createCrudController;