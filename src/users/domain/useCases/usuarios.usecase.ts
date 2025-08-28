// src/usuarios/domain/usecases/usuarios.usecase.ts
import { Inject, Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosUseCasePort } from '../ports/in/usuarios.usecase.port';
import { UsuariosPersistencePort } from '../ports/out/usuarios.persistence.port';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { RegisterEmpresaDto, LoginDto } from '../../application/dtos/auth-requests.dto';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { JwtPayload } from 'src/users/auth/jwt-payload.interface';


@Injectable()
export class UsuariosUseCase implements UsuariosUseCasePort {
  constructor(
    @Inject(UsuariosPersistencePort)
    private readonly persistencePort: UsuariosPersistencePort,
    private readonly jwtService: JwtService,
  ) {}

  async registerEmpresa(data: RegisterEmpresaDto): Promise<{ user: User; token: string; }> {
    const { empresaNombre, userNombre, userEmail, userPassword } = data;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const result = await this.persistencePort.createEmpresaWithAdmin(
      { nombre: empresaNombre },
      { nombre: userNombre, email: userEmail, password_hash: hashedPassword },
    );

    const token = this.generateJwt(result.usuario);
    return { user: result.usuario, token };
  }

  async registerUser(data: CreateUserDto): Promise<User> {
     const { empresa_id, email } = data;
     const existingUser = await this.persistencePort.findUserByEmail(empresa_id, email);
     if (existingUser) {
       throw new ConflictException(`El email '${email}' ya está registrado en esta empresa.`);
     }

     const salt = await bcrypt.genSalt();
     const hashedPassword = await bcrypt.hash(data.password, salt);

     const newUser = await this.persistencePort.saveUser({
        ...data,
        password_hash: hashedPassword,
     });
     delete newUser.password_hash; // No devolver el hash
     return newUser;
  }

  async login(credentials: LoginDto): Promise<{ user: User; token: string; }> {
    const { empresa_id, email, password } = credentials;
    const user = await this.persistencePort.findUserByEmail(empresa_id, email);

 if (user && user.password_hash && (await bcrypt.compare(password, user.password_hash))) {
  const token = this.generateJwt(user);
  delete user.password_hash;
  return { user, token };
}


    throw new UnauthorizedException('Credenciales incorrectas.');
  }

  async getUserProfile(id: string): Promise<User | null> {
    const user = await this.persistencePort.findUserById(id);
    if (!user) {
        throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    delete user.password_hash;
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User | null> {
    if (data.password) {
        const salt = await bcrypt.genSalt();
        data.password_hash = await bcrypt.hash(data.password, salt);
        delete data.password;
    }
    const updatedUser = await this.persistencePort.updateUser(id, data);
     if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
     if (updatedUser.password_hash) {
      delete updatedUser.password_hash;
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
     const deleted = await this.persistencePort.deleteUser(id);
     if (!deleted) {
         throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
     }
     return true;
  }

  async createRoles(roles: CreateRoleDto[]): Promise<Role[]> {
    return this.persistencePort.saveRoles(roles);
  }

  async listRoles(): Promise<Role[]> {
    return this.persistencePort.findAllRoles();
  }

private generateJwt(user: User): string {
  if (!user.empresa) {
    throw new Error('El usuario no tiene empresa asignada');
  }
  if (!user.rol) {
    throw new Error('El usuario no tiene rol asignado');
  }

  const payload: JwtPayload = {
    usuario_id: user.id,
    empresa_id: typeof user.empresa === 'string' ? user.empresa : user.empresa.id,
    rol: typeof user.rol === 'string' ? user.rol : user.rol.nombre,
  };
  return this.jwtService.sign(payload);
}

}