import { RegisterEmpresaDto } from '../dtos/auth-requests.dto';
import { Empresa } from '../../domain/models/empresa.model';
import { User } from '../../domain/models/user.model';

export class EmpresaMapper {
  static fromRegisterEmpresaDto(dto: RegisterEmpresaDto): { empresa: Empresa; adminUser: User } {
    const empresa = new Empresa();
    empresa.nombre = dto.empresaNombre;
    empresa.plan = 'basic';
    empresa.activo = true;

    const adminUser = new User();
    adminUser.nombre = dto.userNombre;
    adminUser.email = dto.userEmail;
    adminUser.password_hash = dto.userPassword; 
    adminUser.activo = true;

    return { empresa, adminUser };
  }
}
