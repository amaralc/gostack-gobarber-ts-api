/**
 * Se nao precisamos de custom repository, usamos apenas o get repository
 * com funcionalidades basicas, create, update, delete, etc.
 */
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: Request): Promise<User> {
    /** Cria repository ja com funcionalidades basicas */
    const usersRepository = getRepository(User);

    /** Busca usuario com email igual ao informado */
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

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
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    /** Salva usuario na base de dados */
    await usersRepository.save(user);

    /** Retorna usuario */
    return user;
  }
}

export default CreateUserService;
