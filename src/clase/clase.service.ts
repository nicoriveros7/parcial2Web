import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
  ) {}

  // crearClase() -
  async crearClase(
    nombre: string,
    codigo: string,
    creditos: number,
  ): Promise<ClaseEntity> {
    if (codigo.length !== 10) {
      throw new BusinessLogicException(
        'El código de la clase debe tener 10 caracteres',
        BusinessError.BAD_REQUEST,
      );
    }

    const clase = this.claseRepository.create({ nombre, codigo, creditos });
    return await this.claseRepository.save(clase);
  }

  // findClaseById(id)
  async findClaseById(id: string): Promise<ClaseEntity> {
    const clase = await this.claseRepository.findOne({ where: { id } });
    if (!clase) {
      throw new BusinessLogicException(
        'Clase no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return clase;
  }
}
