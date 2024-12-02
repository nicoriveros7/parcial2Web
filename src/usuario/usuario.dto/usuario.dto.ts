import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';

export class UsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly grupoInvestigacion: string;

  @IsNumber()
  @IsNotEmpty()
  readonly extension: number;

  @IsString()
  @IsNotEmpty()
  readonly rol: string;

  @IsString()
  @IsOptional()
  readonly jefeId?: string;
}
