import { Router } from "express";
// import rateLimit from "express-rate-limit";

import {
  login,
  logout,
  recoverPassword,
  refreshToken,
  getProfile,
  resetPassword,
  verificarCorreo
} from "../controllers/auth.controller";

import { verifySession } from "../middleware/verifySession";

const router = Router();

/* ============================================================
   AUTH ROUTES
   ============================================================
   Rutas relacionadas con autenticación y seguridad:
   - Login
   - Logout
   - Recuperación de contraseña
   - Refresh de JWT
   - Perfil de usuario
   ============================================================ */


/* ============================================================
   RATE LIMIT (opcional / recomendado)
   ============================================================
   Se puede aplicar especialmente a:
   - /login
   - /recover
   para evitar ataques de fuerza bruta
   ============================================================ */
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 5,                  // 5 intentos
//   message: "Demasiados intentos, intente más tarde"
// });


/* ============================================================
   LOGIN
   ============================================================
   POST /auth/login
   Body:
   {
     "rutOrEmail": string,
     "password": string
   }
   Respuesta:
   - JWT
   - sessionToken
   ============================================================ */
router.post("/login", login); // ← aquí podrías aplicar loginLimiter


/* ============================================================
   LOGOUT (PROTEGIDO)
   ============================================================
   POST /auth/logout
   Headers:
   - Authorization: Bearer <jwt>
   - x-session-token: <sessionToken>
   ============================================================ */
router.post("/logout", verifySession, logout);


/* ============================================================
   RECUPERAR CONTRASEÑA
   ============================================================
   POST /auth/recover
   Body:
   {
     "correo": string
   }
   Respuesta siempre genérica (seguridad)
   ============================================================ */
router.post("/recover", recoverPassword);

router.post("/verify",verificarCorreo)


/* ============================================================
   RESET DE CONTRASEÑA
   ============================================================
   POST /auth/reset-password
   Body:
   {
     "correo": string,
     "codigo": number,
     "nuevaClave": string
   }
   ============================================================ */
router.post("/reset-password", resetPassword);


/* ============================================================
   REFRESH TOKEN (PROTEGIDO)
   ============================================================
   POST /auth/refresh
   Headers:
   - Authorization: Bearer <jwt expirado>
   - x-session-token: <sessionToken>
   ============================================================ */
router.post("/refresh", verifySession, refreshToken);


/* ============================================================
   PERFIL DE USUARIO (PROTEGIDO)
   ============================================================
   GET /auth/profile
   Headers:
   - Authorization: Bearer <jwt>
   ============================================================ */
router.get("/profile", verifySession, getProfile);


export default router;
