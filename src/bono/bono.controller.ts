import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BonoDto } from '../bono/bono.dto/bono.dto';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { BonoService } from './bono.service';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

  @Post()
  async crearBono(
    @Body('monto') monto: number,
    @Body('usuarioId') usuarioId: string,
    @Body('claseId') claseId: string,
    @Body('palabraClave') palabraClave: string,
    @Body('calificacion') calificacion: number,
  ): Promise<BonoEntity> {
    return await this.bonoService.crearBono(
      monto,
      usuarioId,
      claseId,
      palabraClave,
      calificacion,
    );
  }

  @Get('clase/:codigo')
  async findByCodigo(@Param('codigo') codigo: string): Promise<BonoEntity[]> {
    return await this.bonoService.findBonoByCodigo(codigo);
  }

  @Get('usuario/:usuarioId')
  async findAllByUsuario(
    @Param('usuarioId') usuarioId: string,
  ): Promise<BonoEntity[]> {
    return await this.bonoService.findAllBonosByUsuario(usuarioId);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoId') bonoId: string): Promise<void> {
    return await this.bonoService.deleteBono(bonoId);
  }
}
