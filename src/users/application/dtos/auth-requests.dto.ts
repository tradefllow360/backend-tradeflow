// src/usuarios/application/dtos/auth-requests.dto.ts
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterEmpresaDto {
  @IsString()
  @IsNotEmpty()
  empresaNombre: string;

  @IsString()
  @IsNotEmpty()
  userNombre: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @MinLength(8)
  userPassword: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  empresa_id: string; // O podría ser el nombre de la empresa

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}