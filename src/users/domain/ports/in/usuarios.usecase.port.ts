// src/usuarios/domain/ports/in/usuarios.usecase.port.ts
// Nota: Esta interfaz es muy similar a la del servicio de aplicación.
// El caso de uso es la implementación concreta de esta lógica de negocio.

import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { CreateUserDto } from 'src/users/application/dtos/create-user.dto';
import { CreateRoleDto } from 'src/users/application/dtos/create-role.dto';
import { UpdateUserDto } from 'src/users/application/dtos/update-user.dto';
import { RegisterEmpresaDto, LoginDto } from 'src/users/application/dtos/auth-requests.dto';
import { Empresa } from '../../models/empresa.model';
import { LoginModel } from '../../models/login.model';


export abstract class UsuariosUseCasePort {
  abstract registerEmpresa(
    empresa: Empresa,
    adminUser: User
  ): Promise<{ user: User; token: string }>;

  abstract registerUser(user: User): Promise<User>;

  abstract login(credentials: LoginModel): Promise<{ user: User; token: string } | null>;

  abstract getUserProfile(id: string): Promise<User | null>;

  abstract updateUser(user: User): Promise<User | null>;

  abstract deleteUser(id: string): Promise<boolean>;

  abstract createRoles(roles: Role[]): Promise<Role[]>;

  abstract listRoles(): Promise<Role[]>;
}
