const { getPool, sql } = require("../config/db");
const ApiError = require("../utils/ApiError");

async function executeSP(spName, params = []) {
  try {
    const pool = getPool();
    const request = pool.request();

    for (const param of params) {
      request.input(param.name, param.type, param.value ?? null);
    }

    const result = await request.execute(spName);

    return result.recordset || [];
  } catch (error) {
    console.error(`SQL ERROR ${spName}:`, {
      message: error.message,
      code: error.code,
      original: error.originalError?.info?.message,
    });

    throw new ApiError(500, `Error en ${spName}`, {
      code: error.code,
      message: error.message,
    });
  }
}

module.exports = {
  executeSP,
  sql,
};