// src/usuarios/application/services/impl/usuarios.service.impl.ts
import { Inject, Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';
import { UsuariosUseCasePort } from '../../../domain/ports/in/usuarios.usecase.port';
import { RegisterEmpresaDto, LoginDto } from '../../dtos/auth-requests.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { CreateRoleDto } from '../../dtos/create-role.dto';

@Injectable()
export class UsuariosServiceImpl implements UsuariosService {
  constructor(
    @Inject(UsuariosUseCasePort)
    private readonly userUseCase: UsuariosUseCasePort,
  ) {}

  registerEmpresa(data: RegisterEmpresaDto) {
    return this.userUseCase.registerEmpresa(data);
  }

  registerUser(data: CreateUserDto) {
    //mapeo 
    return this.userUseCase.registerUser(data);
  }

  login(credentials: LoginDto) {
    return this.userUseCase.login(credentials);
  }

  getUserProfile(id: string) {
    return this.userUseCase.getUserProfile(id);
  }
  
  updateUser(id: string, data: UpdateUserDto) {
      return this.userUseCase.updateUser(id, data);
  }

  deleteUser(id: string) {
      return this.userUseCase.deleteUser(id);
  }

  createRoles(roles: CreateRoleDto[]) {
      return this.userUseCase.createRoles(roles);
  }

  listRoles() {
    return this.userUseCase.listRoles();
  }
}