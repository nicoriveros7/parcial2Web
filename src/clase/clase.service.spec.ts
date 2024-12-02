import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaseService } from './clase.service';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

describe('ClaseService', () => {
  let service: ClaseService;
  let claseRepository: Repository<ClaseEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    claseRepository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await claseRepository.clear();

    for (let i = 0; i < 5; i++) {
      await claseRepository.save({
        id: faker.string.uuid(),
        nombre: faker.lorem.words(2),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int({ min: 1, max: 5 }),
      });
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearClase should create a new clase', async () => {
    const clase = await service.crearClase('Test Clase', 'ABCDEFGHIJ', 3);

    expect(clase).not.toBeNull();
    expect(clase.nombre).toEqual('Test Clase');
    expect(clase.codigo).toEqual('ABCDEFGHIJ');
    expect(clase.creditos).toEqual(3);
  });

  it('crearClase should throw an exception if codigo length is not 10', async () => {
    await expect(service.crearClase('Test Clase', 'SHORT', 3)).rejects.toThrow(
      BusinessLogicException,
    );
  });

  it('findClaseById should return a clase by ID', async () => {
    const clase = await claseRepository.findOne({ where: {} });
    const foundClase = await service.findClaseById(clase.id);

    expect(foundClase).not.toBeNull();
    expect(foundClase.id).toEqual(clase.id);
  });

  it('findClaseById should throw an exception if clase is not found', async () => {
    await expect(service.findClaseById('invalid-id')).rejects.toThrow(
      BusinessLogicException,
    );
  });
});
