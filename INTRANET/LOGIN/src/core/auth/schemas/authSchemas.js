import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Ingrese su usuario (RUT o email)"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

export const recoverSchema = z.object({
  correo: z
    .string()
    .min(3, "Debe ingresar correo o RUT"),
});

export const UserSchema = z.object({
  Correo: z.string().email(),
  Rol: z.string(),
});

/* SCHEMA APP (mínimo para no romper) */
export const AppSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().optional(),
  path: z.string().optional(),
  icon: z.string().optional()
}).passthrough();

export const LoginResponseSchema = z.object({
  message: z.string().optional(),

  jwt: z.string(),
  session: z.string(),

  user: UserSchema,

  entidadID: z.number().optional(),
  entidadId: z.number().optional(),

  apps: z.array(AppSchema).default([]),
});

export const RefreshResponseSchema = z.object({
  jwt: z.string(),
});