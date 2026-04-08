import { getConnection } from "../config/db";

export const getUsers = async () => {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT TOP 10 Correo, Rut, Rol FROM TBL_SEG_Usuarios");
  return result.recordset;
};
