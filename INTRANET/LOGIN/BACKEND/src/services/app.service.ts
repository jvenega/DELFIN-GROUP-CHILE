import { getConnection } from "../config/db";
import { Aplicacion } from "../interfaces/app.interface"

export async function getAppsByUser(idUsuario: number): Promise<Aplicacion[]> {

  const db = await getConnection()

  const result = await db
    .request()
    .input("ID_Entidad", idUsuario)
    .query(`
      SELECT
      ID_Aplicacion,
        nombre_app,
        LINK,
        onblank,
        embed,
        nombre_proveedor
      FROM TBL_Aplicaciones_Proovedores
      WHERE ID_Entidad = @ID_Entidad
    `)
    

  return result.recordset
}


