// src/usuarios/application/dtos/create-user.dto.ts
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  empresa_id: string;
  
  @IsString()
  @IsNotEmpty()
  nombre: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  rol_id: string;
}