// src/usuarios/infrastructure/mappers/user.mapper.ts
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/models/user.model';
import { UserEntity } from '../entities/user.schema';
import { Empresa } from '../../domain/models/empresa.model';
import { EmpresaEntity } from '../entities/empresa.schema';
import { Role } from '../../domain/models/role.model';
import { RoleEntity } from '../entities/role.schema';

@Injectable()
export class UserMapper {
entityToModel(entity: UserEntity): User {
  const user = new User();
  user.id = entity._id.toString();
  user.nombre = entity.nombre;
  user.email = entity.email;
  user.password_hash = entity.password_hash;
  user.activo = entity.activo;
  user.ultimo_login = entity.ultimo_login;

  // Mapear relaciones si están populadas
  if (entity.empresa && entity.empresa instanceof EmpresaEntity) {
    user.empresa = this.empresaEntityToModel(entity.empresa);
  } else {
    user.empresa = entity.empresa.toString();
  }

  if (entity.rol && entity.rol instanceof RoleEntity) {
    user.rol = this.roleEntityToModel(entity.rol);
  } else {
    user.rol = entity.rol.toString();
  }

  return user;
}
  
empresaEntityToModel(entity: EmpresaEntity): Empresa {
  const model = new Empresa();
  if (!entity) {
    model.id = '';
    model.nombre = '';
    // ... inicializa con valores por defecto
    return model;
  }
  model.id = entity._id.toString();
  model.nombre = entity.nombre;
  // ... otros campos
  return model;
}

roleEntityToModel(entity: RoleEntity): Role {
  const model = new Role();
  if (!entity) {
    model.id = '';
    model.nombre = '';
    model.descripcion = '';
    return model;
  }
  model.id = entity._id.toString();
  model.nombre = entity.nombre;
  model.descripcion = entity.descripcion;
  return model;
}

}