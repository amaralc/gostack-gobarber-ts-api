/**
 * Se nao precisamos de custom repository, usamos apenas o get repository
 * com funcionalidades basicas, create, update, delete, etc.
 */
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: IRequest): Promise<User> {
    /** Busca usuario com email igual ao informado */
    const checkUserExists = await this.usersRepository.findByEmail(email);

    /** Se nenhuma entidade foi encontrada, retorna erro */
    if (checkUserExists) {
      /** Retorna erro status 400 */
      throw new AppError('Email address already used');
    }

    /**
     * Define hash da senha, passando hash e tamanho do 'salt' que sera utilizado
     * Ref: https://en.wikipedia.org/wiki/Salt_(cryptography)
     */
    const hashedPassword = await hash(password, 8);

    /** Cria instancia de usuario */
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    /** Retorna usuario */
    return user;
  }
}

export default CreateUserService;
