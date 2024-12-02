import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class BonoDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly monto: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsNotEmpty()
  readonly palabraClave: string;

  @IsNumber()
  @IsNotEmpty()
  readonly usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly claseId: number;
}
