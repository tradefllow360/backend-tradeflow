// src/usuarios/domain/usecases/usuarios.usecase.ts
import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosUseCasePort } from '../ports/in/usuarios.usecase.port';
import { UsuariosPersistencePort } from '../ports/out/usuarios.persistence.port';

import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Empresa } from '../models/empresa.model';
import { LoginModel } from '../models/login.model';
import { JwtPayload } from 'src/users/auth/jwt-payload.interface';

@Injectable()
export class UsuariosUseCase implements UsuariosUseCasePort {
  constructor(
    @Inject(UsuariosPersistencePort)
    private readonly persistencePort: UsuariosPersistencePort,
    private readonly jwtService: JwtService,
  ) {}

  async registerEmpresa(
    empresa: Empresa,
    adminUser: User,
  ): Promise<{ user: User; token: string }> {
    // hashear password del admin
    const salt = await bcrypt.genSalt();
    adminUser.password_hash = await bcrypt.hash(adminUser.password_hash!, salt);

    const result = await this.persistencePort.createEmpresaWithAdmin(
      empresa,
      adminUser,
    );

    const token = this.generateJwt(result.usuario);
    delete result.usuario.password_hash;
    return { user: result.usuario, token };
  }

  async registerUser(user: User): Promise<User> {
    // validar email duplicado
    const empresaId =
      typeof user.empresa === 'string' ? user.empresa : user.empresa.id;
    const existingUser = await this.persistencePort.findUserByEmail(
      empresaId,
      user.email,
    );
    if (existingUser) {
      throw new ConflictException(
        `El email '${user.email}' ya está registrado en esta empresa.`,
      );
    }

    // hashear password
    const salt = await bcrypt.genSalt();
    user.password_hash = await bcrypt.hash(user.password_hash!, salt);

    const newUser = await this.persistencePort.saveUser(user);
    delete newUser.password_hash;
    return newUser;
  }

  async login(credentials: LoginModel): Promise<{ user: User; token: string }> {
    const { empresaId, email, password } = credentials;
    const user = await this.persistencePort.findUserByEmail(empresaId, email);

    if (
      user &&
      user.password_hash &&
      (await bcrypt.compare(password, user.password_hash))
    ) {
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

  async updateUser(user: User): Promise<User | null> {
    if (user.password_hash) {
      const salt = await bcrypt.genSalt();
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }

    const updatedUser = await this.persistencePort.updateUser(user.id, user);
    if (!updatedUser) {
      throw new NotFoundException(
        `Usuario con ID '${user.id}' no encontrado.`,
      );
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

  async createRoles(roles: Role[]): Promise<Role[]> {
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
      empresa_id:
        typeof user.empresa === 'string' ? user.empresa : user.empresa.id,
      rol: typeof user.rol === 'string' ? user.rol : user.rol.nombre,
    };
    return this.jwtService.sign(payload);
  }
}
