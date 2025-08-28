// src/usuarios/application/dtos/create-role.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  
  @IsString()
  @IsOptional()
  descripcion?: string;
}