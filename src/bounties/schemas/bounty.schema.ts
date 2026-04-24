import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Pirate } from '../../pirates/schemas/pirate.schema';

export enum BountyStatus {
  WANTED = 'Wanted',
  CAPTURED = 'Captured',
}

@Schema({ timestamps: true, collection: 'bounties' })
export class Bounty extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Pirate',
    required: true,
  })
  pirata!: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'La cantidad debe ser un número entero',
    },
  })
  cantidadBellys!: number;

  @Prop({
    type: String,
    enum: {
      values: Object.values(BountyStatus),
      message: 'El estado debe ser Wanted o Captured',
    },
    required: true,
    default: BountyStatus.WANTED,
  })
  estado!: BountyStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BountySchema = SchemaFactory.createForClass(Bounty);

BountySchema.index({ pirata: 1 });
BountySchema.index({ estado: 1 });
