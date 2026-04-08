import { getConnection } from "../config/db";

export const execSP = async (spName: string, params: Record<string, any> = {}) => {
  const pool = await getConnection();
  const request = pool.request();

  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });

  const result = await request.execute(spName);
  return result.recordset;
};
