import { getConnection } from "../config/db";
import jwt from "jsonwebtoken";
import { Usuario, VerificationResponse } from "../interfaces/usuario.interface";
import { spRegistrarLogAcceso, spLogoutUsuario } from "../database/procedures/auth.proc";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import winston from "winston";

/* ============================================================
   CONFIGURACIÓN DE LOGGING
   ============================================================
   - Logger centralizado para autenticación y seguridad
   - Guarda logs en archivo y consola
   - Formato con timestamp legible
   ============================================================ */
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `[${timestamp}] [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "auth.log") }),
    new winston.transports.Console(),
  ],
});

/* ============================================================
   UTILIDADES
   ============================================================ */

/**
 * Enmascara tokens para evitar exposición en logs
 */
const maskToken = (token: string) =>
  token ? `${token.slice(0, 4)}...${token.slice(-4)}` : "null";

/**
 * Respuesta estándar de autenticación
 */
interface AuthResponse {
  success: boolean;
  estado: string;
  jwtToken?: string;
  sessionToken?: string;
  user?: Usuario;
}

/* ============================================================
   LOGIN DE USUARIO
   ============================================================
   - Valida credenciales
   - Ejecuta SP de login
   - Genera JWT y token de sesión
   - Registra auditoría de acceso
   ============================================================ */

/**
 * Autentica un usuario mediante SP_SEG_LoginUsuario
 */
export const authenticateUser = async (
  usuario: string,
  clave: string,
  ip: string = "0.0.0.0"
): Promise<AuthResponse> => {

  // Validación básica de entrada
  if (!usuario || !clave) {
    logger.warn(`AUTH_MISSING_CREDENTIALS usuario=${usuario}`);
    return { success: false, estado: "CREDENCIALES_INCOMPLETAS" };
  }

  const pool = await getConnection();
  logger.info(`AUTH_START usuario=${usuario} ip=${ip}`);

  try {
    // Ejecución del SP de login
    const result = await pool.request()
      .input("USUARIO", usuario)
      .input("CLAVE", clave)
      .execute("SP_SEG_LoginUsuario");

    // Obtención segura del estado devuelto por el SP
    const estado =
      result.recordset?.[0]?.ESTADO ||
      Object.values(result.recordset?.[0] ?? {})[0];

    logger.info(`AUTH_SP_RESULT usuario=${usuario} estado=${estado}`);

    /* ------------------------------------------------------------
       CASO: AUTENTICACIÓN EXITOSA
       ------------------------------------------------------------ */
    if (estado === "SI") {

      // Obtención de datos del usuario
      const userQuery = await pool.request()
        .input("USUARIO", usuario)
        .query(`
          SELECT TOP 1 ID_Entidad, Correo, RUT, Rol, Bloqueado
          FROM TBL_SEG_Usuarios
          WHERE (Correo = @USUARIO OR RUT = @USUARIO)
        `);

      const user = userQuery.recordset?.[0];
      if (!user) {
        throw new Error("Usuario no encontrado tras validación exitosa.");
      }

      // Validación de bloqueo
      if (user.Bloqueado === 1) {
        logger.warn(`AUTH_BLOCKED_AFTER_VALIDATION usuario=${usuario}`);
        return { success: false, estado: "BLOQUEADO" };
      }

      // Generación de JWT
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET no configurado");

      const expiresIn = process.env.JWT_EXPIRATION || "5m";
      const jwtToken = jwt.sign(
        { userId: user.Correo, rol: user.Rol },
        secret as jwt.Secret,
        { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
      );

      // Generación de token de sesión interno
      const sessionToken = crypto.randomBytes(24).toString("hex");

      // Registro de acceso exitoso
      await spRegistrarLogAcceso(user.Correo, 0, "EXITOSO", ip);

      logger.info(
        `AUTH_SUCCESS usuario=${user.Correo} rol=${user.Rol} ip=${ip} jwtExp=${expiresIn} sessionId=${maskToken(sessionToken)}`
      );

      return { success: true, estado, jwtToken, sessionToken, user };
    }

    /* ------------------------------------------------------------
       CASOS: AUTENTICACIÓN FALLIDA
       ------------------------------------------------------------ */
    let motivo = "CREDENCIALES_INVALIDAS";
    if (estado === "DENEGADO") motivo = "CUENTA_INACTIVA";
    if (estado === "BLOQUEADO") motivo = "USUARIO_BLOQUEADO";
    if (estado === "INCORRECTO") motivo = "DATOS_INCORRECTOS";

    await spRegistrarLogAcceso(usuario, 1, motivo, ip);
    logger.warn(`AUTH_FAIL usuario=${usuario} estado=${estado} motivo=${motivo} ip=${ip}`);

    return { success: false, estado };

  } catch (error: any) {
    logger.error(`AUTH_ERROR usuario=${usuario} ip=${ip} error="${error.message}"`);
    throw new Error(`Error en autenticación: ${error.message}`);
  }
};

/* ============================================================
   GENERACIÓN DE TOKEN JWT (UTILIDAD)
   ============================================================ */

/**
 * Genera un JWT para un usuario dado
 */
export const generateToken = (userId: string, rol?: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET no configurado");

  const expiresIn = process.env.JWT_EXPIRATION || "5m";
  const token = jwt.sign(
    { userId, rol },
    secret as jwt.Secret,
    { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
  );

  logger.info(`TOKEN_GENERATED userId=${userId} exp=${expiresIn}`);
  return token;
};

/* ============================================================
   LOGOUT DE USUARIO
   ============================================================ */

/**
 * Cierra la sesión de un usuario
 */
export const logoutUser = async (
  usuario: string,
  token: string,
  ip: string = "0.0.0.0"
): Promise<string> => {

  logger.info(`LOGOUT_START usuario=${usuario} sessionId=${maskToken(token)} ip=${ip}`);

  try {
    const result = await spLogoutUsuario(usuario, token);

    if (!result.recordset || result.recordset.length === 0) {
      logger.warn(`LOGOUT_NOT_FOUND usuario=${usuario} sessionId=${maskToken(token)} ip=${ip}`);
      throw new Error("Sesión no encontrada o ya cerrada");
    }

    const estado = result.recordset[0].Estado_Sesion;

    logger.info(`LOGOUT_SUCCESS usuario=${usuario} estado=${estado} ip=${ip}`);
    return estado;

  } catch (error: any) {
    logger.error(`LOGOUT_ERROR usuario=${usuario} sessionId=${maskToken(token)} ip=${ip} error="${error.message}"`);
    throw error;
  }
};

/* ============================================================
   RECUPERACIÓN DE CONTRASEÑA - GENERAR CÓDIGO
   ============================================================ */

/**
 * Genera y almacena un código de verificación para recuperación de contraseña
 */
export const generateVerificationCode = async (
  usuario: string,
  ip: string = "0.0.0.0"
): Promise<VerificationResponse> => {

  if (!usuario) {
    logger.warn(`VERIF_MISSING_USER usuario=${usuario}`);
    return { success: false, estado: "USUARIO_REQUERIDO" };
  }

  const pool = await getConnection();
  logger.info(`VERIF_START usuario=${usuario} ip=${ip}`);

  try {
    const result = await pool.request()
      .input("USUARIO", usuario)
      .execute("SP_SEG_CodigoVerificacion");

    /* ======================================================
       NORMALIZAR RECORDSETS (array seguro para TS)
       ====================================================== */
    const recordsetsArray = Array.isArray(result.recordsets)
      ? result.recordsets
      : Object.values(result.recordsets);

    const record = recordsetsArray[recordsetsArray.length - 1]?.[0];

    if (!record) {
      logger.error(`VERIF_EMPTY_RESULT usuario=${usuario}`);
      return { success: false, estado: "ERROR" };
    }

    const { Estado: estado, Verifica: codigo } = record;
    logger.info(`VERIF_SP_RESULT usuario=${usuario} estado=${estado}`);

    if (estado === "SI") {
      logger.info(
        `VERIF_SUCCESS usuario=${usuario} codigo=${
          process.env.NODE_ENV === "development" ? codigo : "HIDDEN"
        }`
      );

      return {
        success: true,
        estado,
        codigo
      };
    }

    logger.warn(`VERIF_FAIL usuario=${usuario} estado=${estado} ip=${ip}`);
    return { success: false, estado };

  } catch (error: any) {
    logger.error(
      `VERIF_ERROR usuario=${usuario} ip=${ip} error="${error.message}"`
    );
    throw new Error(`Error en generación de código: ${error.message}`);
  }
};


export const spVerificarCorreo = async (
  usuario: string,
  ip: string = "0.0.0.0"
): Promise<"SI" | "NO" | "ERROR"> => {

  if (!usuario) {
    logger.warn(`VERIF_MISSING_USER usuario=${usuario}`);
    return "ERROR";
  }

  const pool = await getConnection();
  logger.info(`VERIF_START usuario=${usuario} ip=${ip}`);

  try {
    const result = await pool.request()
      .input("USUARIO", usuario)
      .execute("SP_SEG_VerificaCorreo");

    /* ======================================================
       NORMALIZAR RECORDSETS (array seguro para TS)
       ====================================================== */
    const recordsetsArray = Array.isArray(result.recordsets)
      ? result.recordsets
      : Object.values(result.recordsets);

    const record = recordsetsArray[recordsetsArray.length - 1]?.[0];

    if (!record) {
      logger.error(`VERIF_EMPTY_RESULT usuario=${usuario}`);
      return "ERROR";
    }

    // El SP retorna SELECT @ESTADO (columna sin nombre)
    const estado = record[""] as "SI" | "NO";

    logger.info(`VERIF_SP_RESULT usuario=${usuario} estado=${estado}`);

    return estado;

  } catch (error: any) {
    logger.error(
      `VERIF_ERROR usuario=${usuario} ip=${ip} error="${error.message}"`
    );
    throw new Error(`Error en SP_SEG_VerificaCorreo: ${error.message}`);
  }
};


export const verifyUser= async (
  usuario: string,
  ip: string = "0.0.0.0"
): Promise<VerificationResponse> => {

  if (!usuario) {
    logger.warn(`VERIF_EXIST_USER usuario=${usuario}`);
    return { success: false, estado: "USUARIO_NO ENCONTRADO" };
  }

  const pool = await getConnection();
  logger.info(`VERIF_START usuario=${usuario} ip=${ip}`);

  try {
    const result = await pool.request()
      .input("USUARIO", usuario)
      .execute("SP_SEG_VerificaCorreo");

    /* ======================================================
       NORMALIZAR RECORDSETS (array seguro para TS)
       ====================================================== */
    const recordsetsArray = Array.isArray(result.recordsets)
      ? result.recordsets
      : Object.values(result.recordsets);

    const record = recordsetsArray[recordsetsArray.length - 1]?.[0];

    if (!record) {
      logger.error(`VERIF_EMPTY_RESULT usuario=${usuario}`);
      return { success: false, estado: "ERROR" };
    }

    const { Estado: estado, Verifica: codigo } = record;
    logger.info(`VERIF_SP_RESULT usuario=${usuario} estado=${estado}`);

    if (estado === "SI") {
      logger.info(
        `VERIF_SUCCESS usuario=${usuario} codigo=${
          process.env.NODE_ENV === "development" ? codigo : "HIDDEN"
        }`
      );

      return {
        success: true,
        estado,
        codigo
      };
    }

    logger.warn(`VERIF_FAIL usuario=${usuario} estado=${estado} ip=${ip}`);
    return { success: false, estado };

  } catch (error: any) {
    logger.error(
      `VERIF_ERROR usuario=${usuario} ip=${ip} error="${error.message}"`
    );
    throw new Error(`Error en generación de código: ${error.message}`);
  }
};


/* ============================================================
   VERIFICAR CÓDIGO DE RECUPERACIÓN
   ============================================================ */

/**
 * Verifica si el código de recuperación es válido
 */
export const verifyVerificationCode = async (
  usuario: string,
  codigo: number
): Promise<{ success: boolean }> => {

  const pool = await getConnection();
  logger.info(`VERIFY_CODE_START usuario=${usuario}`);

  try {
    const result = await pool.request()
      .input("USUARIO", usuario)
      .input("CODIGO", codigo)
      .execute("SP_SEG_VerificaCodigo");

    // Tomar el último recordset por seguridad
    const recordsetsArray = Array.isArray(result.recordsets)
      ? result.recordsets
      : Object.values(result.recordsets);

    const record = recordsetsArray[recordsetsArray.length - 1]?.[0];

    if (!record) {
      logger.warn(`VERIFY_CODE_EMPTY usuario=${usuario}`);
      return { success: false };
    }

    // ⚠️ CLAVE: leer el PRIMER valor del objeto
    const estado = Object.values(record)[0];

    logger.info(
      `VERIFY_CODE_RESULT usuario=${usuario} estado=${estado}`
    );

    return { success: estado === "SI" };

  } catch (error: any) {
    logger.error(
      `VERIFY_CODE_ERROR usuario=${usuario} error="${error.message}"`
    );
    throw new Error("Error al verificar el código");
  }
};

/* ============================================================
   RESET DE CONTRASEÑA
   ============================================================ */

/**
 * Verifica el código de recuperación y actualiza la contraseña
 */
export const resetPasswordService = async (
  usuario: string,
  codigo: number,
  nuevaClave: string
): Promise<{ success: boolean; reason?: string }> => {

  const pool = await getConnection();
  logger.info(`RESET_PASSWORD_START usuario=${usuario}`);

  try {
    /* ======================================================
       PASO 1: Verificar código (SP_SEG_VerificaCodigo)
       ====================================================== */
    const verification = await verifyVerificationCode(usuario, codigo);

    if (!verification.success) {
      logger.warn(`RESET_PASSWORD_INVALID_CODE usuario=${usuario}`);
      return { success: false, reason: "CODIGO_INVALIDO" };
    }

    /* ======================================================
       PASO 2: Ejecutar SP de cambio de clave
       ====================================================== */
    const result = await pool.request()
      .input("USUARIO", usuario)
      .input("CLAVE", nuevaClave)
      .execute("SP_SEG_CambioClave");

    // ⚠️ IMPORTANTE: xp_cmdshell genera múltiples recordsets
    const recordsetsArray = Array.isArray(result.recordsets)
      ? result.recordsets
      : Object.values(result.recordsets);

    const record = recordsetsArray[recordsetsArray.length - 1]?.[0];
    const estado = record?.Estado;

    logger.info(`RESET_PASSWORD_SP_RESULT usuario=${usuario} estado=${estado}`);

    if (estado !== "SI") {
      return { success: false };
    }

    return { success: true };

  } catch (error: any) {
    logger.error(
      `RESET_PASSWORD_ERROR usuario=${usuario} error="${error.message}"`
    );
    throw new Error("Error al resetear contraseña");
  }
};
