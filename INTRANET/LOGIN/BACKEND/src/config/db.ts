import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "",
  server: process.env.DB_SERVER || "",
  options: {
    encrypt: true,            // true si usas Azure; false en local
    trustServerCertificate: true // necesario si usas SSL local
  }
};

let pool: sql.ConnectionPool;

export const getConnection = async (): Promise<sql.ConnectionPool> => {
  if (pool) return pool;

  try {
    pool = await sql.connect(dbConfig);
    console.log("✅ Conectado a SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ Error de conexión a la BD:", err);
    throw err;
  }
};
