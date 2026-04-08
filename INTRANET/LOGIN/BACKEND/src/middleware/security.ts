import { Request, Response, NextFunction } from "express";
import { verifySession } from "./verifySession"; // tu middleware actual
import winston from "winston";

/* ============================================================
   🔹 Configuración del logger de seguridad
============================================================ */
const securityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
  ),
  transports: [new winston.transports.File({ filename: "logs/security.log" })],
});

/* ============================================================
   🔹 Middleware global de logging de solicitudes protegidas
============================================================ */
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || "0.0.0.0";
  const jwt = req.headers.authorization ? "sí" : "no";
  const session = req.headers["x-session-token"] ? "sí" : "no";
  securityLogger.info(`Ruta=${req.path} Método=${req.method} JWT=${jwt} Session=${session} IP=${ip}`);
  next();
};

/* ============================================================
   🔹 Middleware combinado: logging + verificación de sesión
============================================================ */
export const protectedRoute = [securityMiddleware, verifySession];
