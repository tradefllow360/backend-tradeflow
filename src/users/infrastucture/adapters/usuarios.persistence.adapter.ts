// src/usuarios/infrastructure/adapters/usuarios.persistence.adapter.ts
import { Injectable } from '@nestjs/common';
import { UsuariosPersistencePort } from '../../domain/ports/out/usuarios.persistence.port';
import { UsuariosRepository } from '../repository/usuarios.repository';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../domain/models/user.model';
import { Empresa } from '../../domain/models/empresa.model';
import { Role } from '../../domain/models/role.model';
import { UserEntity } from '../entities/user.schema';
import { EmpresaEntity } from '../entities/empresa.schema';
import { use } from 'passport';

@Injectable()
export class UsuariosPersistenceAdapter implements UsuariosPersistencePort {
  constructor(
    private readonly repository: UsuariosRepository,
    private readonly mapper: UserMapper
  ) { }

  async findUserByEmail(empresaId: string, email: string): Promise<User | null> {
    const userEntity = await this.repository.findByEmailAndEmpresa(empresaId, email);

    if (!userEntity) {
      return null;
    }

    return this.mapper.entityToModel(userEntity);
  }


  async findUserById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findById(id);

    if(!userEntity){
      return null;
    }
    return this.mapper.entityToModel(userEntity);
  }

  async saveUser(user: Partial<User>): Promise<User> {
    // Aquí se debería convertir el modelo de dominio a entidad antes de guardar
    // Por simplicidad, pasamos el objeto directamente asumiendo compatibilidad
    console.log(user)
    const empresaEntity =await this.repository.findByIdEmpresa(user.empresa?.toString() || '');
    const roleEntity = await this.repository.findByIdRole(user.rol?.toString() || '');

    if(empresaEntity == null){
       throw new Error('Empresa no encontrada');
    }
    if(roleEntity == null){
      throw new Error('Rol no encontrado');
   }  
    const userEntity = new UserEntity();
    userEntity.nombre = user.nombre || '';
    userEntity.email = user.email || '';
    userEntity.password_hash = user.password_hash || '';
    userEntity.empresa = empresaEntity;
    userEntity.rol = roleEntity;
    userEntity.activo = user.activo || false;
    userEntity.ultimo_login = user.ultimo_login || new Date();

    const newUserEntity = await this.repository.create(user as any);
    if(!newUserEntity){
      return new User;
    }
    return this.mapper.entityToModel(newUserEntity);
  }

  async createEmpresaWithAdmin(empresa: Partial<Empresa>, admin: Partial<User>): Promise<{ empresa: Empresa; usuario: User; }> {
    const { empresa: empresaEntity, usuario: userEntity } = await this.repository.createEmpresaAndAdmin(empresa, admin as any);
    return {
      empresa: this.mapper.empresaEntityToModel(empresaEntity),
      usuario: this.mapper.entityToModel(userEntity),
    };
  }

  async saveRoles(roles: Partial<Role>[]): Promise<Role[]> {
    const savedEntities = await this.repository.createRoles(roles);
    return savedEntities.map(this.mapper.roleEntityToModel);
  }

  async findAllRoles(): Promise<Role[]> {
    const roleEntities = await this.repository.findAllRoles();
    
    return roleEntities.map(this.mapper.roleEntityToModel);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    const updatedEntity = await this.repository.update(id, user as any);
    if (!updatedEntity) {
      return null;
    }
    return this.mapper.entityToModel(updatedEntity);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}