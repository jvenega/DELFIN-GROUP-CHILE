import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { spValidarSesion } from "../database/procedures/auth.proc";

/* ============================================================
   🔒 Middleware: Verifica JWT y sesión activa
============================================================ */
export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Validar encabezado Authorization
    const authHeader = req.headers.authorization?.trim();
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "JWT no proporcionado" });
    }

    // Soporta "Bearer token" o solo token
    const tokenParts = authHeader.split(/\s+/);
    const jwtToken =
      tokenParts.length === 2 && tokenParts[0].toLowerCase() === "bearer"
        ? tokenParts[1]
        : tokenParts[0];

    if (!jwtToken) {
      return res
        .status(401)
        .json({ success: false, message: "Token JWT ausente o mal formado" });
    }

    // 2️⃣ Validar firma (ignorando expiración para obtener payload)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ Falta variable JWT_SECRET en el entorno");
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }

    let decoded: JwtPayload | null = null;

    try {
      decoded = jwt.verify(jwtToken, secret, {
        ignoreExpiration: true,
      }) as JwtPayload;
    } catch (err: any) {
      console.warn("JWT manipulado o inválido:", err.message);
      return res
        .status(401)
        .json({ success: false, message: "JWT inválido o manipulado" });
    }

    if (!decoded?.userId || !decoded?.exp) {
      return res
        .status(401)
        .json({ success: false, message: "JWT sin identificador válido" });
    }

    // 3️⃣ Permitir margen de gracia de 30 segundos
    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.exp;
    const secondsExpired = now - exp;

    if (secondsExpired > 30) {
      console.warn("JWT expirado definitivamente");
      return res
        .status(401)
        .json({ success: false, message: "JWT expirado, requiere renovación" });
    } else if (secondsExpired > 0) {
      console.info(
        `JWT ligeramente expirado (${secondsExpired}s) — dentro del margen permitido`
      );
    }

    // 4️⃣ Validar token de sesión corto
    const sessionToken = req.headers["x-session-token"] as string | undefined;
    if (!sessionToken) {
      return res
        .status(401)
        .json({ success: false, message: "Token de sesión no proporcionado" });
    }

    // 5️⃣ Consultar validez de sesión en BD
    let estadoSesion: string;
    try {
      estadoSesion = await spValidarSesion(sessionToken);
    } catch (err: any) {
      console.error("Error al validar sesión:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Error al validar sesión" });
    }

    if (estadoSesion !== "ACTIVA") {
      return res
        .status(401)
        .json({ success: false, message: "Sesión expirada o inválida" });
    }

    // ✅ 6️⃣ Inyectar usuario en request
    (req as Request & { user?: { id: string } }).user = { id: decoded.userId };

    next();
  } catch (error: any) {
    console.error("Error inesperado en verifySession:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token inválido o mal formado" });
  }
};
