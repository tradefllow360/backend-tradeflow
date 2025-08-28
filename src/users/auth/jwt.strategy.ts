// src/usuarios/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsuariosPersistencePort } from '../domain/ports/out/usuarios.persistence.port';
import { User } from '../domain/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly persistencePort: UsuariosPersistencePort) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'tuClaveSecretaSuperSegura2025', // ¡Cambiar en producción!
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { usuario_id } = payload;
    const user: User | null= await this.persistencePort.findUserById(usuario_id);

    if (!user || !user.activo) {
      throw new UnauthorizedException();
    }
    
    // Devolvemos el payload para que esté disponible en el objeto `req.user`
    return payload;
  }
}