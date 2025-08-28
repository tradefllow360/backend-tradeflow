// src/usuarios/infrastructure/controllers/usuarios.controller.ts
import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from '../../application/services/usuarios.service';
import { RegisterEmpresaDto, LoginDto } from '../../application/dtos/auth-requests.dto';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { JwtAuthGuard } from '../../auth/jwt.guard';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('/register-empresa')
  registerEmpresa(@Body() registerEmpresaDto: RegisterEmpresaDto) {
    return this.usuariosService.registerEmpresa(registerEmpresaDto);
  }

  @Post('/register')
  // @UseGuards(JwtAuthGuard) // Proteger esta ruta para que solo admins puedan registrar
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usuariosService.registerUser(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.usuariosService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    // El payload del JWT decodificado se adjunta al request por el guard
    return this.usuariosService.getUserProfile(req.user.usuario_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usuariosService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usuariosService.deleteUser(id);
  }
  
  @Post('/roles')
  @UseGuards(JwtAuthGuard) // Proteger esta ruta
  createRoles(@Body() createRoleDtos: CreateRoleDto[]) {
      return this.usuariosService.createRoles(createRoleDtos);
  }

  @Get('/roles')
  listRoles() {
    return this.usuariosService.listRoles();
  }
}