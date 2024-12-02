import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsuarioDto } from '../usuario/usuario.dto/usuario.dto';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { UsuarioService } from './usuario.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async crearUsuario(@Body() usuarioDto: UsuarioDto): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.crearUsuario(
      usuario.cedula,
      usuario.nombre,
      usuario.grupoInvestigacion,
      usuario.extension,
      usuario.rol,
    );
  }

  @Get(':id')
  async findUsuarioById(@Param('id') id: string): Promise<UsuarioEntity> {
    return await this.usuarioService.findUsuarioById(id);
  }

  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string): Promise<void> {
    return await this.usuarioService.eliminarUsuario(id);
  }
}
