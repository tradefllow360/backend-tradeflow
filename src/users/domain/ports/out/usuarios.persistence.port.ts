// src/usuarios/domain/ports/out/usuarios.persistence.port.ts
import { User } from '../../models/user.model';
import { Empresa } from '../../models/empresa.model';
import { Role } from '../../models/role.model';

export abstract class UsuariosPersistencePort {
  abstract findUserByEmail(empresaId: string, email: string): Promise<User | null>;
  abstract findUserById(id: string): Promise<User | null>;
  abstract saveUser(user: Partial<User>): Promise<User>;
  abstract createEmpresaWithAdmin(empresa: Partial<Empresa>, admin: Partial<User>): Promise<{ empresa: Empresa; usuario: User }>;
  abstract saveRoles(roles: Partial<Role>[]): Promise<Role[]>;
  abstract findAllRoles(): Promise<Role[]>;
  abstract updateUser(id: string, user: Partial<User>): Promise<User | null>;
  abstract deleteUser(id: string): Promise<boolean>;
}