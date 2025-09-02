import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { LoginDto } from '../dtos/auth-requests.dto';
import { User } from '../../domain/models/user.model';
import { LoginModel } from 'src/users/domain/models/login.model';

export class UserMapper {
  // DTO -> Model para registro de usuario
  static fromCreateUserDto(dto: CreateUserDto): User {
    const user = new User();
    user.empresa = dto.empresa_id; // solo el id de la empresa
    user.nombre = dto.nombre;
    user.email = dto.email;
    user.password_hash = dto.password; // se hasheará en el use case
    user.rol = dto.rol_id; // solo el id del rol
    user.activo = true;
    return user;
  }

  // DTO -> Model para actualización
static fromUpdateUserDto(dto: UpdateUserDto, userId: string): User {
  const user = new User();
  user.id = userId;
  if (dto.nombre !== undefined) user.nombre = dto.nombre;
  if (dto.email !== undefined) user.email = dto.email;
  if (dto.password !== undefined) user.password_hash = dto.password;
  user.rol = dto.rol_id ?? null;
  user.activo = dto.activo ?? true;
  return user;
}

  // DTO -> Model para login
static fromLoginDto(dto: LoginDto): LoginModel {
  return {
    empresaId: dto.empresa_id,
    email: dto.email,
    password: dto.password,
  };
}
}
