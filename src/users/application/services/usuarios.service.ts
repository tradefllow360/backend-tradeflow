// src/usuarios/application/services/usuarios.service.ts
// Esta interfaz define el contrato público que el controlador usará.
// Es una buena práctica para desacoplar el controlador de la implementación.

import { RegisterEmpresaDto, LoginDto } from '../dtos/auth-requests.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';

export abstract class UsuariosService {
  abstract registerEmpresa(data: RegisterEmpresaDto);
  abstract registerUser(data: CreateUserDto);
  abstract login(credentials: LoginDto);
  abstract getUserProfile(id: string);
  abstract updateUser(id: string, data: UpdateUserDto);
  abstract deleteUser(id: string);
  abstract createRoles(roles: CreateRoleDto[]);
  abstract listRoles();
}