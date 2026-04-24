import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsPositive,
  IsMongoId,
} from 'class-validator';
import { BountyStatus } from '../schemas/bounty.schema';

export class UpdateBountyDto {
  @IsOptional()
  @IsMongoId()
  pirata?: string;

  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
  )
  @IsPositive()
  cantidadBellys?: number;

  @IsOptional()
  @IsEnum(BountyStatus)
  estado?: BountyStatus;
}

