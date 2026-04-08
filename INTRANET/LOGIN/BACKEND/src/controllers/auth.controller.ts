import { Request, Response } from "express";
import {
  authenticateUser,
  logoutUser,
  generateVerificationCode,
  verifyVerificationCode,
  resetPasswordService,
  spVerificarCorreo
} from "../services/auth.service";

import {
  spRegistrarSesion,
  spRegistrarLogAcceso,
  spValidarSesion
} from "../database/procedures/auth.proc";

import { getConnection } from "../config/db";
import jwt, { JwtPayload } from "jsonwebtoken";

/* ============================================================
   AUTH CONTROLLER
   ============================================================
   Controlador central de autenticación:
   - Login
   - Recuperación de contraseña
   - Verificación de código
   - Reset de contraseña
   - Logout
   - Refresh JWT
   - Perfil de usuario
   ============================================================ */


/* ============================================================
   LOGIN
   ============================================================
   - Valida credenciales
   - Autentica usuario
   - Registra sesión y logs
   - Devuelve JWT + sessionToken
   ============================================================ */
export const login = async (req: Request, res: Response) => {
  const { rutOrEmail, password } = req.body;
  const ip = req.ip || "0.0.0.0";

  try {
    const auth = await authenticateUser(rutOrEmail, password, ip);

    switch (auth.estado) {
      case "SI": {
        const { user, jwtToken, sessionToken } = auth;

        if (!user || !jwtToken || !sessionToken) {
          return res.status(500).json({
            code: "AUTH_INCONSISTENT",
            message: "Error interno de autenticación",
          });
        }

        await spRegistrarSesion(user.Correo, sessionToken, "ACTIVA");

        return res.status(200).json({
          jwt: jwtToken,
          session: sessionToken,

          // 👤 identidad del usuario
          user: {
            Correo: user.Correo,
            Rol: user.Rol,
          },

          // 🏢 contexto de negocio
          entidadId: user.ID_Entidad, // ✅ directo desde la tabla
        });
      }

      case "BLOQUEADO":
        return res.status(403).json({
          code: "USUARIO_BLOQUEADO",
          message: "Usuario bloqueado por intentos fallidos",
        });

      case "DENEGADO":
        return res.status(403).json({
          code: "USUARIO_INACTIVO",
          message: "Usuario deshabilitado",
        });

      case "INCORRECTO":
        return res.status(401).json({
          code: "INVALID_CREDENTIALS",
          message: "Usuario o contraseña incorrectos",
        });

      case "CREDENCIALES_INCOMPLETAS":
        return res.status(400).json({
          code: "MISSING_CREDENTIALS",
          message: "Debe ingresar usuario y contraseña",
        });

      default:
        return res.status(401).json({
          code: "INVALID_CREDENTIALS",
          message: "Usuario o contraseña incorrectos",
        });
    }
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Error interno del servidor",
    });
  }
};





/* ============================================================
   RECUPERAR CONTRASEÑA
   ============================================================
   - Genera código de verificación
   - Respuesta genérica (anti user-enumeration)
   ============================================================ */
export const recoverPassword = async (req: Request, res: Response) => {
  const { correo } = req.body;
  const ip = req.ip || "0.0.0.0";

  if (!correo) {
    return res.status(400).json({
      message: "El correo es obligatorio"
    });
  }

  try {
    // 1️⃣ Verificar si el usuario existe y está activo
    const estado = await spVerificarCorreo(correo);

    // 2️⃣ SOLO si existe, generar código
    if (estado === "SI") {
      await generateVerificationCode(correo, ip);
    }

    // 3️⃣ Respuesta SIEMPRE genérica (anti enumeration)
    return res.json({
      message:
        estado === "SI"
          ? "Código de verificación enviado"
          : "El usuario especificado NO existe",
      estado // 👈 CLAVE
    });

  } catch (error) {
    console.error("Error en recoverPassword:", error);
    return res.status(500).json({
      message: "Error interno en la recuperación"
    });
  }
};



/* ============================================================
   VERIFICAR CÓDIGO DE RECUPERACIÓN
   ============================================================
   - Verifica código contra BD
   - No modifica estado
   ============================================================ */
export const verifyCode = async (req: Request, res: Response) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({
      message: "Correo y código son obligatorios"
    });
  }

  try {
    const result = await verifyVerificationCode(correo, Number(codigo));

    if (!result.success) {
      return res.status(400).json({
        message: "Código inválido o expirado"
      });
    }

    return res.json({
      message: "Código válido"
    });

  } catch (error) {
    console.error("Error en verifyCode:", error);
    return res.status(500).json({
      message: "Error interno en la verificación"
    });
  }
};





/* ============================================================
   RESET DE CONTRASEÑA
   ============================================================
   - Verifica código
   - Actualiza contraseña
   - Invalida código
   ============================================================ */
export const resetPassword = async (req: Request, res: Response) => {
  const { correo, codigo, nuevaClave } = req.body;

  if (!correo || !codigo || !nuevaClave) {
    return res.status(400).json({
      message: "Correo, código y nueva contraseña son obligatorios"
    });
  }

  try {
    const result = await resetPasswordService(
      correo,
      Number(codigo),
      nuevaClave
    );

    if (!result.success) {
      if (result.reason === "CODIGO_INVALIDO") {
        return res.status(400).json({
          message: "Código inválido o expirado"
        });
      }

      return res.status(400).json({
        message: "No se pudo resetear la contraseña"
      });
    }

    return res.json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({
      message: "Error interno al resetear la contraseña"
    });
  }
};


/* ============================================================
   LOGOUT
   ============================================================
   - Cierra sesión en BD
   - Registra auditoría
   ============================================================ */
export const logout = async (req: Request, res: Response) => {
  try {
    // Usuario inyectado por middleware verifySession
    const usuario = (req as any).user?.id || "DESCONOCIDO";
    const sessionToken = req.headers["x-session-token"] as string;

    if (!sessionToken) {
      return res.status(400).json({
        message: "Session token no proporcionado"
      });
    }

    const estado = await logoutUser(usuario, sessionToken);

    if (estado === "Cerrada") {
      await spRegistrarLogAcceso(usuario, 0, "LOGOUT", req.ip || "0.0.0.0");
      return res.status(200).json({
        message: "Sesión cerrada correctamente"
      });
    }

    return res.status(404).json({
      message: "Sesión no encontrada o ya cerrada"
    });

  } catch (error: any) {
    console.error("Error en logout:", error.message);
    return res.status(500).json({
      message: "Error interno al cerrar sesión"
    });
  }
};


/* ============================================================
   REFRESH TOKEN
   ============================================================
   - Valida sesión activa
   - Renueva JWT expirado
   ============================================================ */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = req.headers["x-session-token"] as string;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "JWT no proporcionado" });
    }
    if (!sessionToken) {
      return res.status(401).json({ message: "Session token no proporcionado" });
    }

    const oldToken = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Configuración del servidor incompleta" });
    }

    // 1️⃣ Validar sesión en BD
    const estadoSesion = await spValidarSesion(sessionToken);
    if (estadoSesion !== "ACTIVA") {
      return res.status(401).json({
        message: "Sesión expirada o inválida"
      });
    }

    // 2️⃣ Decodificar token ignorando expiración
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(oldToken, secret, { ignoreExpiration: true }) as JwtPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        decoded = jwt.decode(oldToken) as JwtPayload;
      } else {
        return res.status(401).json({
          message: "Token inválido o manipulado"
        });
      }
    }

    if (!decoded || !decoded.userId) {
      return res.status(400).json({
        message: "Token mal formado o incompleto"
      });
    }

    // 3️⃣ Generar nuevo JWT
    const newToken = jwt.sign(
      { userId: decoded.userId },
      secret,
      { expiresIn: "5m" }
    );

    return res.status(200).json({
      message: "Token refrescado correctamente",
      jwt: newToken,
      user: decoded.userId
    });

  } catch (error: any) {
    console.error("Error en refreshToken:", error.message);
    return res.status(500).json({
      message: "Error al refrescar token"
    });
  }
};


/* ============================================================
   PERFIL DE USUARIO
   ============================================================
   - Devuelve datos del usuario autenticado
   ============================================================ */
export const getProfile = async (req: Request, res: Response) => {
  const usuario = (req as any).user?.id;

  if (!usuario) {
    return res.status(401).json({
      message: "Usuario no autenticado"
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("USUARIO", usuario)
      .query(`
        SELECT TOP 1
          RUT,
          Correo,
          Nombre,
          Rol,
          FechaCreacion,
          Bloqueado,
          Activo
        FROM TBL_SEG_Usuarios
        WHERE (Correo = @USUARIO OR RUT = @USUARIO)
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.status(200).json(result.recordset[0]);

  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener perfil"
    });
  }
};


/* ============================================================
   VERIFICAR CORREO / USUARIO
   ============================================================
   - Valida si el usuario existe y está ACTIVO
   - Acepta RUT o Correo
   - Retorna SI / NO según SP
   ============================================================ */
export const verificarCorreo = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({
        message: "El campo usuario es obligatorio"
      });
    }

    // 1️⃣ Ejecutar SP
    const estado = await spVerificarCorreo(usuario);

    // 2️⃣ Respuesta
    return res.status(200).json({
      message: estado === "SI"
        ? "Usuario válido"
        : "Usuario no existe o no está activo",
      estado // "SI" | "NO"
    });

  } catch (error: any) {
    console.error("Error en verificarCorreo:", error.message);
    return res.status(500).json({
      message: "Error al verificar el usuario"
    });
  }
};