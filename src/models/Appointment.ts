/** Importa entidade (algo a ser salvo no banco de dados) */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  provider: string;

  /** Define date como tipo 'timestamp with time zone' */
  @Column('timestamp with time zone')
  date: Date;
}

export default Appointment;
