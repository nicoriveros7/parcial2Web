import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClaseDto } from '../clase/clase.dto/clase.dto';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { ClaseService } from './clase.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Post()
  async create(@Body() claseDto: ClaseDto): Promise<ClaseEntity> {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
    return await this.claseService.crearClase(
      clase.nombre,
      clase.codigo,
      clase.creditos,
    );
  }

  @Get(':id')
  async findClaseById(@Param('id') id: string): Promise<ClaseEntity> {
    return await this.claseService.findClaseById(id);
  }
}
