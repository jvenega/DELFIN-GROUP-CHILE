import { getConnection } from "../../config/db";

/* ============================================================
   TEMPORAL: CONSULTAS DIRECTAS
   Cuando los SP estén listos, cambia .query() → .execute("SP_SEG_...")
   ============================================================ */

// === 1. LOGIN DE USUARIO ===
export const spLoginUsuario = async (rutOrEmail: string, password: string) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input("rutOrEmail", rutOrEmail)
    .input("password", password)
    .query(`
      SELECT TOP 1 *
      FROM TBL_SEG_Usuarios
      WHERE (Correo = @rutOrEmail OR RUT = @rutOrEmail)
        AND Clave = @password
        AND (Bloqueado IS NULL OR Bloqueado = 0)
    `);
  return result.recordset;
};

// === 2. REGISTRAR SESIÓN ===
export const spRegistrarSesion = async (usuario: string, sesionId: string, estado: string) => {
  const pool = await getConnection();

  // Caducar sesiones activas previas
  await pool.request()
    .input("Usuario", usuario)
    .query(`
      UPDATE TBL_SEG_Sesion
      SET Estado_Sesion = 'CADUCADA',
          Fecha_Caducada = GETDATE(),
          Evento_Caduca = 'NUEVA_SESION'
      WHERE Usuario = @Usuario AND Estado_Sesion = 'ACTIVA'
    `);

  // Insertar nueva sesión
  await pool.request()
    .input("Usuario", usuario)
    .input("Sesion_ID", sesionId)
    .input("Estado_Sesion", estado)
    .query(`
      INSERT INTO TBL_SEG_Sesion (Usuario, Sesion_ID, Estado_Sesion, Fecha_Creacion)
      VALUES (@Usuario, @Sesion_ID, @Estado_Sesion, GETDATE())
    `);

  // Caducar sesiones activas con más de 5 minutos
  await pool.request()
    .query(`
      UPDATE TBL_SEG_Sesion
      SET Estado_Sesion = 'CADUCADA',
          Fecha_Caducada = GETDATE(),
          Evento_Caduca = 'INACTIVIDAD'
      WHERE Estado_Sesion = 'ACTIVA'
        AND DATEDIFF(MINUTE, Fecha_Creacion, GETDATE()) >= 5
    `);
};

// === 3. REGISTRAR LOG DE ACCESO ===
export const spRegistrarLogAcceso = async (usuario: string, intento: number, estado: string, ip: string) => {
  const pool = await getConnection();
  await pool.request()
    .input("Usuario", usuario)
    .input("Intento", intento)
    .input("Estado_Acceso", estado)
    .input("IP_Origen", ip)
    .query(`
      INSERT INTO TBL_SEG_LOG_Accesos
      (Usuario, Intento, Existe, Estado_Acceso, IP_Origen, Fecha_Intento)
      VALUES (@Usuario, @Intento, 'SI', @Estado_Acceso, @IP_Origen, GETDATE())
    `);

  
};

// === 4. BLOQUEAR USUARIO ===
export const spBloquearUsuario = async (usuario: string) => {
  const pool = await getConnection();
  await pool.request()
    .input("Usuario", usuario)
    .query(`
      UPDATE TBL_SEG_Usuarios
      SET Bloqueado = 1, Intentos = 0
      WHERE (Correo = @Usuario OR RUT = @Usuario)
    `);
};

// === 5. RESETEAR INTENTOS ===
export const spResetIntentos = async (usuario: string) => {
  const pool = await getConnection();
  await pool.request()
    .input("Usuario", usuario)
    .query(`
      UPDATE TBL_SEG_Usuarios
      SET Intentos = 0,
          Bloqueado = 0,
          UltimoLogin = GETDATE()
      WHERE (Correo = @Usuario OR RUT = @Usuario)
    `);
};

// === 6. VALIDAR SESIÓN ===
export const spValidarSesion = async (sesionId: string) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input("Sesion_ID", sesionId)
    .query(`
      SELECT TOP 1 Estado_Sesion
      FROM TBL_SEG_Sesion
      WHERE Sesion_ID = @Sesion_ID
    `);

  if (result.recordset.length === 0) return "NO_EXISTE";
  return result.recordset[0].Estado_Sesion;
};

// === 7. SOLICITAR RECUPERACIÓN DE CLAVE ===
export const spSolicitarRecuperacion = async (correo: string, token: string) => {
  const pool = await getConnection();

  // Verificar si el usuario existe
  const existe = await pool.request()
    .input("Correo", correo)
    .query(`
      SELECT COUNT(*) AS total
      FROM TBL_SEG_Usuarios
      WHERE Correo = @Correo
    `);

  if (existe.recordset[0].total === 0) {
    return { Estado: "NO_EXISTE" };
  }

  // Registrar solicitud de recuperación
  await pool.request()
    .input("Correo", correo)
    .input("Token", token)
    .query(`
      INSERT INTO TBL_SEG_RecuperacionClave (Correo, Token, ExpiraEn, Usado)
      VALUES (@Correo, @Token, DATEADD(MINUTE, 15, GETDATE()), 0)
    `);

  return { Estado: "OK" };
};

// === 8. ACTUALIZAR CLAVE POR TOKEN DE RECUPERACIÓN ===
export const spActualizarClave = async (token: string, nuevaClave: string) => {
  const pool = await getConnection();

  // Buscar token válido
  const result = await pool.request()
    .input("Token", token)
    .query(`
      SELECT TOP 1 Correo
      FROM TBL_SEG_RecuperacionClave
      WHERE Token = @Token
        AND Usado = 0
        AND GETDATE() < ExpiraEn
    `);

  if (result.recordset.length === 0) {
    return { Estado: "TOKEN_INVALIDO", Usuario: null };
  }

  const correo = result.recordset[0].Correo;

  // Actualizar clave del usuario
  await pool.request()
    .input("Correo", correo)
    .input("NuevaClave", nuevaClave)
    .query(`
      UPDATE TBL_SEG_Usuarios
      SET Clave = @NuevaClave,
          FechaCambio = GETDATE(),
          DebeCambiarClave = 'NO'
      WHERE Correo = @Correo
    `);

  // Marcar token como usado
  await pool.request()
    .input("Token", token)
    .query(`
      UPDATE TBL_SEG_RecuperacionClave
      SET Usado = 1
      WHERE Token = @Token
    `);

  return { Estado: "OK", Usuario: correo };
};


export const spLogoutUsuario = async (usuario: string, token: string) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input("Usuario", usuario)
    .input("Sesion_ID", token)
    .query(`
      BEGIN TRANSACTION;

      DECLARE @UpdatedRows INT = 0;

      -- Intentar cerrar la sesión por correo o RUT asociado
      UPDATE dbo.TBL_SEG_Sesion
      SET Estado_Sesion = 'Cerrada',
          Evento_Caduca = 'LOG_OUT',
          Fecha_Caducada = ISNULL(Fecha_Caducada, GETDATE())
      OUTPUT INSERTED.Estado_Sesion
      WHERE Sesion_ID = @Sesion_ID
        AND (Usuario = @Usuario 
             OR Usuario IN (
               SELECT TOP 1 RUT FROM dbo.TBL_SEG_Usuarios WHERE Correo = @Usuario
             ));

      SET @UpdatedRows = @@ROWCOUNT;

      -- Actualizar último login solo si el usuario existe
      UPDATE dbo.TBL_SEG_Usuarios
      SET UltimoLogin = GETDATE()
      WHERE Correo = @Usuario OR RUT = @Usuario;

      COMMIT TRANSACTION;

      -- Retornar estado de sesión claro
      SELECT 
        CASE 
          WHEN @UpdatedRows > 0 THEN 'Cerrada'
          ELSE 'NoEncontrada'
        END AS Estado_Sesion;
    `);

  return result;
};
