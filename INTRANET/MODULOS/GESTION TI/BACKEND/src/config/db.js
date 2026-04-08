const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

/**Valida la conexion a la base de datos */
async function validateDB({ requiredSP = [] } = {}) {
  const pool = getPool();

  // 1. DB actual
  const dbResult = await pool.request().query("SELECT DB_NAME() AS db");
  const currentDB = dbResult.recordset[0].db;

  console.log("\n===== VALIDACIÓN BASE DE DATOS =====");
  console.log("DB ACTUAL:", currentDB);

  // 2. Obtener SP
  const spResult = await pool.request().query(`
    SELECT 
      name,
      SCHEMA_NAME(schema_id) AS schema_name
    FROM sys.procedures
  `);

  const availableSP = spResult.recordset.map(
    (sp) => `${sp.schema_name}.${sp.name}`
  );

  console.log(`SP encontrados: ${availableSP.length}\n`);

  // 3. Validación detallada
  let hasError = false;

  if (requiredSP.length > 0) {
    console.log("===== VALIDACIÓN DE SP =====");

    requiredSP.forEach((sp) => {
      if (availableSP.includes(sp)) {
        console.log(`OK   ${sp}`);
      } else {
        console.log(`FAIL ${sp}`);
        hasError = true;
      }
    });

    console.log("===================================\n");

    if (hasError) {
      throw new Error("Existen SP requeridos que no están en la base de datos");
    } else {
      console.log("Todos los SP requeridos están validados correctamente\n");
    }
  }

  // 4. Retorno
  return {
    database: currentDB,
    totalSP: availableSP.length,
    storedProcedures: availableSP,
  };
}

/**
 * Inicializa la conexión (fail fast)
 */
async function initDB() {
  try {
    
    pool = await new sql.ConnectionPool(config).connect();

    console.log("DB conectada");

    pool.on("error", (err) => {
      console.error("SQL Pool Error:", formatError(err));
    });

    return pool;

  } catch (err) {
    const formatted = formatError(err);

    console.error("❌ Error crítico conectando a DB:", formatted);

    // 🔥 decisión: o propagas o matas el proceso (no ambas mal ordenadas)

    process.exit(1); // opción recomendada en backend crítico

    // alternativa (si NO quieres cerrar app):
    // throw err;
  }
}

/**
 * Obtener pool activo
 */
function getPool() {
  if (!pool) {
    throw new Error("Pool no inicializado. Llama a initDB()");
  }
  return pool;
}

/**
 * Normalizador de errores
 */
function formatError(err) {
  return {
    message: err.message,
    code: err.code,
    name: err.name,
    originalError: err.originalError?.info?.message || null,
  };
}

module.exports = {
  sql,
  initDB,
  validateDB,
  getPool,
};