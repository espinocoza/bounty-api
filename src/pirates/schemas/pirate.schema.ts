import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'pirates' })
export class Pirate extends Document {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  nombre!: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  tripulacion!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  tieneFrutaDelDiablo!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PirateSchema = SchemaFactory.createForClass(Pirate);

PirateSchema.index({ nombre: 1 });
PirateSchema.index({ tripulacion: 1 });

