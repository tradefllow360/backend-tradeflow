import { Role } from '../../domain/models/role.model';
import { CreateRoleDto } from '../dtos/create-role.dto';


export class RoleMapper {
  static fromCreateRoleDto(dto: CreateRoleDto): Role {
    const role = new Role();
    role.nombre = dto.nombre;
    role.descripcion = dto.descripcion;
    return role;
  }

  static fromCreateRoleDtos(dtos: CreateRoleDto[]): Role[] {
    return dtos.map((dto) => this.fromCreateRoleDto(dto));
  }

}
