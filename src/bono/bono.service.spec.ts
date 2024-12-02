import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonoService } from './bono.service';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let claseRepository: Repository<ClaseEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let clase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );
    claseRepository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await bonoRepository.clear();
    await claseRepository.clear();
    await usuarioRepository.clear();

    usuario = await usuarioRepository.save({
      id: faker.string.uuid(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'TICSW',
      extension: 12345678,
      rol: 'Profesor',
    });

    clase = await claseRepository.save({
      id: faker.string.uuid(),
      nombre: faker.lorem.words(2),
      codigo: 'ABCDEFGHIJ',
      creditos: faker.number.int({ min: 1, max: 5 }),
    });

    await bonoRepository.save({
      monto: faker.number.int({ min: 100, max: 1000 }),
      calificacion: faker.number.float({ min: 0, max: 5 }),
      palabraClave: faker.lorem.word(),
      usuario: usuario,
      clase: clase,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearBono should create a new bono', async () => {
    const bono = await service.crearBono(
      500,
      usuario.id,
      clase.id,
      'testKeyword',
      4.0,
    );

    expect(bono).not.toBeNull();
    expect(bono.monto).toEqual(500);
    expect(bono.usuario.id).toEqual(usuario.id);
    expect(bono.clase.id).toEqual(clase.id);
    expect(bono.palabraClave).toEqual('testKeyword');
  });

  it('crearBono should throw an exception if monto is not positive', async () => {
    await expect(
      service.crearBono(-100, usuario.id, clase.id, 'testKeyword', 3.0),
    ).rejects.toThrow(BusinessLogicException);
  });

  it('findBonoByCodigo should return bonos by class code', async () => {
    const bonos = await service.findBonoByCodigo(clase.codigo);

    expect(bonos).not.toBeNull();
    expect(bonos.length).toBeGreaterThan(0);
  });

  it('findAllBonosByUsuario should return bonos by user', async () => {
    const bonos = await service.findAllBonosByUsuario(usuario.id);

    expect(bonos).not.toBeNull();
    expect(bonos.length).toBeGreaterThan(0);
  });

  it('deleteBono should remove a bono', async () => {
    const bono = await bonoRepository.findOne({ where: {} });
    await service.deleteBono(bono.id);

    const deletedBono = await bonoRepository.findOne({
      where: { id: bono.id },
    });
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception if calificacion > 4', async () => {
    const bono = await bonoRepository.save({
      monto: 500,
      calificacion: 4.5,
      palabraClave: faker.lorem.word(),
      usuario: usuario,
      clase: clase,
    });

    await expect(service.deleteBono(bono.id)).rejects.toThrow(
      BusinessLogicException,
    );
  });
});
