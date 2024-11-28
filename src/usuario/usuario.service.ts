/* archivo: src/usuario/usuario.service.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  // crearUsuario()
  async create(
    cedula: number,
    nombre: string,
    grupoInvestigacion: string,
    extension: number,
    rol: string,
  ): Promise<UsuarioEntity> {
    if (
      rol === 'Profesor' &&
      !['TICSW', 'IMAGINE', 'COMIT'].includes(grupoInvestigacion)
    ) {
      throw new BusinessLogicException(
        'El grupo de investigación no es válido para un Profesor',
        BusinessError.BAD_REQUEST,
      );
    }

    if (rol === 'Decana' && extension.toString().length !== 8) {
      throw new BusinessLogicException(
        'La extensión de la Decana debe tener 8 dígitos',
        BusinessError.BAD_REQUEST,
      );
    }

    const usuario = this.usuarioRepository.create({
      cedula,
      nombre,
      grupoInvestigacion,
      extension,
      rol,
    });
    return await this.usuarioRepository.save(usuario);
  }

  // findUsuarioById(id)
  async findUsuarioById(id: string): Promise<UsuarioEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new BusinessLogicException(
        'Usuario no encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return usuario;
  }

  // eliminarUsuario(id)
  async remove(id: string): Promise<void> {
    const usuario = await this.findUsuarioById(id);
    if (!usuario) {
      throw new BusinessLogicException(
        'Usuario no encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (usuario.rol === 'Decana' || usuario.bonos.length > 0) {
      throw new BusinessLogicException(
        'No se puede eliminar un usuario con rol de Decana o con bonos asociados',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.usuarioRepository.remove(usuario);
  }
}
