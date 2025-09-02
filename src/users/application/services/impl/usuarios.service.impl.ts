// src/usuarios/application/services/impl/usuarios.service.impl.ts
// src/usuarios/application/services/impl/usuarios.service.impl.ts
import { Inject, Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';
import { UsuariosUseCasePort } from '../../../domain/ports/in/usuarios.usecase.port';
import { RegisterEmpresaDto, LoginDto } from '../../dtos/auth-requests.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { CreateRoleDto } from '../../dtos/create-role.dto';

import { UserMapper } from '../../mappers/user.mapper';
import { EmpresaMapper } from '../../mappers/empresa.mapper';
import { RoleMapper } from '../../mappers/role.mapper';

@Injectable()
export class UsuariosServiceImpl implements UsuariosService {
  constructor(
    @Inject(UsuariosUseCasePort)
    private readonly userUseCase: UsuariosUseCasePort,
  ) {}

  registerEmpresa(data: RegisterEmpresaDto) {
    const { empresa, adminUser } = EmpresaMapper.fromRegisterEmpresaDto(data);
    return this.userUseCase.registerEmpresa(empresa, adminUser);
  }

  registerUser(data: CreateUserDto) {
    const user = UserMapper.fromCreateUserDto(data);
    return this.userUseCase.registerUser(user);
  }

  login(credentials: LoginDto) {
    const loginModel = UserMapper.fromLoginDto(credentials);
    return this.userUseCase.login(loginModel);
  }

  getUserProfile(id: string) {
    return this.userUseCase.getUserProfile(id);
  }

  updateUser(id: string, data: UpdateUserDto) {
    const user = UserMapper.fromUpdateUserDto(data, id);
    return this.userUseCase.updateUser(user);
  }

  deleteUser(id: string) {
    return this.userUseCase.deleteUser(id);
  }

  createRoles(roles: CreateRoleDto[]) {
    const roleModels = RoleMapper.fromCreateRoleDtos(roles);
    return this.userUseCase.createRoles(roleModels);
  }

  listRoles() {
    return this.userUseCase.listRoles();
  }
}
