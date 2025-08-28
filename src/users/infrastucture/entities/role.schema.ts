// src/usuarios/infrastructure/entities/role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class RoleEntity extends Document {
  declare _id: Types.ObjectId;
  @Prop({ required: true, unique: true, type: String })
  nombre: string;

  @Prop({ type: String })
  descripcion: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);