// src/usuarios/infrastructure/entities/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmpresaEntity } from './empresa.schema';
import { RoleEntity } from './role.schema';

@Schema({ timestamps: { createdAt: 'fecha_creacion' } })
export class UserEntity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EmpresaEntity', required: true })
  empresa: Types.ObjectId | EmpresaEntity;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RoleEntity', required: true })
  rol: Types.ObjectId | RoleEntity;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ type: Date, nullable: true })
  ultimo_login: Date;

  _id: any;
}

export type UserDocument = UserEntity & Document;
export const UserSchema = SchemaFactory.createForClass(UserEntity);

// índice compuesto
UserSchema.index({ empresa: 1, email: 1 }, { unique: true });
