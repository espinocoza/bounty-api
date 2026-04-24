import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePirateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  nombre!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  tripulacion!: string;

  @IsBoolean()
  tieneFrutaDelDiablo?: boolean = false;
}

