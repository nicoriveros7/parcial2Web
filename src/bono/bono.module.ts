import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { BonoController } from './bono.controller';
import { ClaseModule } from '../clase/clase.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([BonoEntity]), ClaseModule, UsuarioModule],
  providers: [BonoService],
  controllers: [BonoController],
})
export class BonoModule {}
