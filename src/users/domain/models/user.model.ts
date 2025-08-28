// src/usuarios/domain/models/user.model.ts
import { Empresa } from './empresa.model';
import { Role } from './role.model';

export class User {
  id: string;
  empresa: Empresa | string ; // Puede ser el objeto completo o solo el ID
  nombre: string;
  email: string;
  password_hash?: string;
  rol: Role | string | null; // Puede ser el objeto completo o solo el ID
  activo: boolean;
  ultimo_login?: Date;
}