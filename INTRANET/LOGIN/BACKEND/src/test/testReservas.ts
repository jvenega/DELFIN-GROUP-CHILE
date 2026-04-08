// test.ts
import sql from 'mssql';

const config: sql.config = {
  user: 'SistemWEB_User',
  password: '2025!1008Dg',
  server: '192.168.100.16\\DBSQL_DELFIN',
  database: 'Sistemas_WEB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testSP_ROLEO_RESERVA() {
  let pool: sql.ConnectionPool | null = null;
  try {
    pool = await sql.connect(config);

    const result = await pool.request()
      .input('ID', sql.Int, 2)
      .input('NAVE', sql.VarChar(100), 'BUENOS AIRES EXPRESS')
      .input('VIAJE', sql.Int, 25143)
      .input('ETD', sql.Int, 20251110)
      .execute('SP_ROLEO_RESERVA');

    console.log('Resultado del SP_ROLEO_RESERVA:', result.recordset);
  } catch (err) {
    console.error('Error al ejecutar el SP:', err);
  } finally {
    if (pool) await pool.close(); // correcto: cerrar el pool, no sql
  }
}

testSP_ROLEO_RESERVA();
