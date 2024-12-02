import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  grupoInvestigacion: string;

  @Column()
  extension: number;

  @Column()
  rol: string;

  @Column({ nullable: true })
  jefeId: string;

  @OneToMany(() => BonoEntity, (bono) => bono.usuario)
  bonos: BonoEntity[];

  @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
  clases: ClaseEntity[];
}

//@ManyToOne(() => UsuarioEntity, (usuario) => usuario.jefes)
//jefe: UsuarioEntity;
