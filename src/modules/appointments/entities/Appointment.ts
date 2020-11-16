/** Importa entidade (algo a ser salvo no banco de dados) */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '../../users/entities/User';

/**
 * Utiliza experimental decorators (@) para definir que o model
 * Appointment deve ser salvo dentro da tabela 'appointments'.
 *
 * Os decorators, indicam que a informação da linha imediatamente abaixo do
 * decorator deve ser passada como parâmetro para a entidade indicada pelo
 * sinal @.
 */
@Entity('appointments')
class Appointment {
  /** Define id como primary generated column of type uuid */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Define provider como coluna (nao gerada) do tipo string (padrão) */
  @Column()
  provider_id: string;

  /** Relacionamento tipo 'muitos' deste model para 'um' do model referenciado */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  /** Define date como tipo 'timestamp with time zone' */
  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
