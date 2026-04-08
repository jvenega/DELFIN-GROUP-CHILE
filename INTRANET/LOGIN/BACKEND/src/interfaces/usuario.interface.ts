export interface Usuario {
  ID_Entidad: number;
  Correo: string;          // Identificador principal
  Clave: string;
  RUT: string;             // RUT del usuario
  Rol: string | null;      // Rol (ADMIN, SOPORTE, USUARIO, etc.)
  Permisos?: string | null;
  OBJETO?: string | null;
  Bloqueado: number;       // 0 = activo, 1 = bloqueado
  Intentos: number;        // Intentos fallidos
  FechaCreacion?: Date | null;
  FechaCambio?: Date | null;
  DebeCambiarClave?: string | null;
  UltimoLogin?: Date | null;
}

export interface VerificationResponse {
  success: boolean;
  estado: string;
  codigo?: number;
}
