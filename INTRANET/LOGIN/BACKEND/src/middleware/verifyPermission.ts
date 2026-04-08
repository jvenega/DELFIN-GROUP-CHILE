import { Request, Response, NextFunction } from "express";
import { getConnection } from "../config/db";

export const verifyPermission = (requiredPerm: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });

    const pool = await getConnection();
    const result = await pool.request()
      .input("Usuario", userId)
      .execute("SP_SEG_ObtenerPermisosUsuario");

    if (result.recordset.length === 0) {
      return res.status(403).json({ message: "Sin permisos" });
    }

    const permisos = result.recordset.map(p => p.Permiso);
    if (!permisos.includes(requiredPerm)) {
      return res.status(403).json({ message: "Permiso denegado" });
    }

    next();
  };
};
