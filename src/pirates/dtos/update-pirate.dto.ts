import {
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdatePirateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  tripulacion?: string;

  @IsOptional()
  @IsBoolean()
  tieneFrutaDelDiablo?: boolean;
}
