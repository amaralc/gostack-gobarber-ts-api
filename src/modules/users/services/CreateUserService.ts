import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ name, email, password }: IRequest): Promise<User> {
    /** Busca usuario com email igual ao informado */
    const checkUserExists = await this.usersRepository.findByEmail(email);

    /** Se nenhuma entidade foi encontrada, retorna erro */
    if (checkUserExists) {
      /** Retorna erro status 400 */
      throw new AppError('Email address already used');
    }

    /** Define hash da senha */
    const hashedPassword = await this.hashProvider.generateHash(password);

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
