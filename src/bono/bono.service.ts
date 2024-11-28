/* archivo: src/bono/bono.service.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  // crearBono() –
  async create(
    monto: number,
    usuarioId: string,
    claseId: string,
  ): Promise<BonoEntity> {
    if (monto <= 0) {
      throw new BusinessLogicException(
        'El monto del bono debe ser positivo',
        BusinessError.BAD_REQUEST,
      );
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario || usuario.rol !== 'Profesor') {
      throw new BusinessLogicException(
        'El bono solo puede ser asignado a un Profesor',
        BusinessError.BAD_REQUEST,
      );
    }

    const clase = await this.claseRepository.findOne({
      where: { id: claseId },
    });
    if (!clase) {
      throw new BusinessLogicException(
        'La clase asociada al bono no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const bono = this.bonoRepository.create({ monto, usuario, clase });
    return await this.bonoRepository.save(bono);
  }

  // findBonoByCodigo(cod de la clase),
  async findBonoByCodigo(codigo: string): Promise<BonoEntity[]> {
    const clase = await this.claseRepository.findOne({ where: { codigo } });
    if (!clase) {
      throw new BusinessLogicException(
        'Clase no encontrada con el código proporcionado',
        BusinessError.NOT_FOUND,
      );
    }

    return await this.bonoRepository.find({
      where: { clase: { id: clase.id } },
    });
  }

  // findAllBonosByUsuario(userID)
  async findAllBonosByUsuario(userID: string): Promise<BonoEntity[]> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userID },
    });
    if (!usuario) {
      throw new BusinessLogicException(
        'Usuario no encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.bonoRepository.find({
      where: { usuario: { id: userID } },
    });
  }

  // deleteBono(id) –
  async remove(id: string): Promise<void> {
    const bono = await this.bonoRepository.findOne({ where: { id } });
    if (!bono) {
      throw new BusinessLogicException(
        'Bono no encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    if (bono.calificacion > 4) {
      throw new BusinessLogicException(
        'No se puede eliminar un bono con calificación mayor a 4',
        BusinessError.BAD_REQUEST,
      );
    }

    await this.bonoRepository.remove(bono);
  }
}
