// src/usuarios/infrastructure/entities/empresa.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'fecha_registro' } })
export class EmpresaEntity extends Document {
  declare _id: Types.ObjectId;
  @Prop({ required: true, unique: true, type: String })
  nombre: string;

  @Prop({ type: String })
  direccion: string;

  @Prop({ type: String })
  telefono: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, enum: ['basic', 'pro', 'enterprise'], default: 'basic' })
  plan: string;

  @Prop({ type: Boolean, default: true })
  activo: boolean;
}

export const EmpresaSchema = SchemaFactory.createForClass(EmpresaEntity);