import {
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { BountyStatus } from '../schemas/bounty.schema';

export class CreateBountyDto {
  @IsNotEmpty()
  @IsMongoId()
  pirata!: string;

  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
  )
  @IsPositive()
  cantidadBellys!: number;

  @IsOptional()
  @IsEnum(BountyStatus)
  estado?: BountyStatus = BountyStatus.WANTED;
}

