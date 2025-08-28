// src/usuarios/infrastructure/entities/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmpresaEntity } from './empresa.schema';
import { RoleEntity } from './role.schema';

@Schema({ timestamps: { createdAt: 'fecha_creacion' } })
export class UserEntity extends Document {
  declare _id: Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EmpresaEntity', required: true })
  empresa: EmpresaEntity ;

  @Prop({ required: true, type: String })
  nombre: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password_hash: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RoleEntity', required: true })
  rol: RoleEntity;

  @Prop({ default: true, type: Boolean })
  activo: boolean;
  
  @Prop({ type: Date, nullable: true })
  ultimo_login: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
// Índice compuesto para asegurar que el email sea único por empresa
UserSchema.index({ empresa: 1, email: 1 }, { unique: true });