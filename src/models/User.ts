/** Importa entidade (algo a ser salvo no banco de dados) */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Utiliza experimental decorators (@) para definir que o model
 * User deve ser salvo dentro da tabela 'users'.
 *
 * Os decorators, indicam que a informação da linha imediatamente abaixo do
 * decorator deve ser passada como parâmetro para a entidade indicada pelo
 * sinal @.
 */
@Entity('users')
class User {
  /** Define id como primary generated column of type uuid */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Define coluna (nao gerada) do tipo string (padrão) */
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
