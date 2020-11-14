/**
 * Se nao precisamos de custom repository, usamos apenas o get repository
 * com funcionalidades basicas, create, update, delete, etc.
 */
import { getRepository } from 'typeorm';
import User from '../models/User';

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
      throw new Error('Email address already used');
    }

    /** Cria instancia de usuario */
    const user = usersRepository.create({
      name,
      email,
      password,
    });

    /** Salva usuario na base de dados */
    await usersRepository.save(user);

    /** Retorna usuario */
    return user;
  }
}

export default CreateUserService;
