import { IsNotEmpty, IsString, IsNumber, Length } from 'class-validator';

export class ClaseDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  //@Length(10, 10, { message: 'El código debe tener exactamente 10 caracteres' })
  readonly codigo: string;

  @IsNumber()
  @IsNotEmpty()
  readonly creditos: number;
}
