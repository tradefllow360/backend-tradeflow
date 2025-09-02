
import { LoginModel } from '../../domain/models/login.model';
import { LoginDto } from '../dtos/auth-requests.dto';

export class LoginMapper {
  static toDomain(dto: LoginDto): LoginModel {
    const model = new LoginModel();
    model.empresaId = dto.empresa_id;
    model.email = dto.email;
    model.password = dto.password;
    return model;
  }

  static toDto(model: LoginModel): LoginDto {
    return {
      empresa_id: model.empresaId,
      email: model.email,
      password: model.password,
    };
  }
}
