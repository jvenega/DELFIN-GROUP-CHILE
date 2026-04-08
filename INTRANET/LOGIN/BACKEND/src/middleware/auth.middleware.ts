import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validateSession } from "../services/auth.service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = req.headers["x-session-token"] as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "TOKEN_REQUERIDO" });
    }

    if (!sessionToken) {
      return res.status(401).json({ message: "SESSION_REQUERIDA" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET_NO_CONFIGURADO" });
    }

    const decoded = jwt.verify(token, secret) as any;

    const isValidSession = await validateSession(
      decoded.userId,
      sessionToken
    );

    if (!isValidSession) {
      return res.status(401).json({ message: "SESSION_INVALIDA" });
    }

    req.user = decoded;
    req.sessionToken = sessionToken;

    next();

  } catch (error: any) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "TOKEN_EXPIRADO" });
    }

    return res.status(401).json({ message: "TOKEN_INVALIDO" });
  }
};