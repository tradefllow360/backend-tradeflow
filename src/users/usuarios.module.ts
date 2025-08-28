// src/usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Capa de Aplicación
import { UsuariosService } from './application/services/usuarios.service';
import { UsuariosServiceImpl } from './application/services/impl/usuarios.service.impl';

// Dominio
import { UsuariosUseCasePort } from './domain/ports/in/usuarios.usecase.port';
import { UsuariosPersistencePort } from './domain/ports/out/usuarios.persistence.port';

// Infraestructura


// Auth
import { JwtStrategy } from './auth/jwt.strategy';
import { UsuariosUseCase } from './domain/useCases/usuarios.usecase';
import { UsuariosPersistenceAdapter } from './infrastucture/adapters/usuarios.persistence.adapter';
import { UsuariosController } from './infrastucture/controllers/usuarios.controller';
import { EmpresaEntity, EmpresaSchema } from './infrastucture/entities/empresa.schema';
import { RoleEntity, RoleSchema } from './infrastucture/entities/role.schema';
import { UserEntity, UserSchema } from './infrastucture/entities/user.schema';
import { UserMapper } from './infrastucture/mappers/user.mapper';
import { UsuariosRepository } from './infrastucture/repository/usuarios.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      { name: EmpresaEntity.name, schema: EmpresaSchema },
      { name: RoleEntity.name, schema: RoleSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'tuClaveSecretaSuperSegura2025', // ¡Debería estar en variables de entorno!
      signOptions: {
        expiresIn: 3600, // 1 hora
      },
    }),
  ],
  controllers: [UsuariosController],
  providers: [
    // --- Capa de Aplicación ---
    {
      provide: UsuariosService,
      useClass: UsuariosServiceImpl,
    },
    // --- Dominio ---
    {
      provide: UsuariosUseCasePort,
      useClass: UsuariosUseCase,
    },
    // --- Infraestructura ---
    {
      provide: UsuariosPersistencePort,
      useClass: UsuariosPersistenceAdapter,
    },
    UsuariosRepository,
    UserMapper,
    // --- Autenticación ---
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule, UsuariosService],
})
export class UsuariosModule {}