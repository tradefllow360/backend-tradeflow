// src/usuarios/application/dtos/update-user.dto.ts
import { IsString, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  rol_id?: string;
  
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  // Campo interno, no parte del DTO de entrada
  password_hash?: string;
}