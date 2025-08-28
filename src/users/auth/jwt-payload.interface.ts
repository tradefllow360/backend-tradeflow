// src/usuarios/auth/jwt-payload.interface.ts
export interface JwtPayload {
  usuario_id: string;
  empresa_id: string;
  rol: string;
}