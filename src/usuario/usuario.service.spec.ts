import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await usuarioRepository.clear();

    await usuarioRepository.save({
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'TICSW',
      extension: 12345678,
      rol: 'Profesor',
    });

    await usuarioRepository.save({
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'IMAGINE',
      extension: 87654321,
      rol: 'Decana',
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearUsuario should create a new usuario', async () => {
    const usuario = await service.crearUsuario(
      12345678,
      'Juan Pérez',
      'COMIT',
      98765432,
      'Profesor',
    );

    expect(usuario).not.toBeNull();
    expect(usuario.cedula).toEqual(12345678);
    expect(usuario.nombre).toEqual('Juan Pérez');
    expect(usuario.grupoInvestigacion).toEqual('COMIT');
    expect(usuario.extension).toEqual(98765432);
    expect(usuario.rol).toEqual('Profesor');
  });

  it('crearUsuario should throw an exception for invalid grupoInvestigacion', async () => {
    await expect(
      service.crearUsuario(
        12345678,
        'Juan Pérez',
        'INVALID_GROUP',
        98765432,
        'Profesor',
      ),
    ).rejects.toThrow(BusinessLogicException);
  });

  it('crearUsuario should throw an exception for invalid extension length for Decana', async () => {
    await expect(
      service.crearUsuario(12345678, 'Ana López', 'TICSW', 1234, 'Decana'),
    ).rejects.toThrow(BusinessLogicException);
  });

  it('findUsuarioById should return a usuario by id', async () => {
    const usuario = await usuarioRepository.findOne({ where: {} });
    const foundUsuario = await service.findUsuarioById(usuario.id);

    expect(foundUsuario).not.toBeNull();
    expect(foundUsuario.id).toEqual(usuario.id);
  });

  it('findUsuarioById should throw an exception for an invalid id', async () => {
    await expect(service.findUsuarioById('invalid-id')).rejects.toThrow(
      BusinessLogicException,
    );
  });

  it('eliminarUsuario should remove a usuario', async () => {
    const usuario = await usuarioRepository.findOne({
      where: { rol: 'Profesor' },
    });
    await service.eliminarUsuario(usuario.id);

    const deletedUsuario = await usuarioRepository.findOne({
      where: { id: usuario.id },
    });
    expect(deletedUsuario).toBeNull();
  });

  it('eliminarUsuario should throw an exception for a Decana', async () => {
    const usuario = await usuarioRepository.findOne({
      where: { rol: 'Decana' },
    });

    await expect(service.eliminarUsuario(usuario.id)).rejects.toThrow(
      BusinessLogicException,
    );
  });
});
