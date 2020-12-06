import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
  }: /** Define retorno como usuario com atributos opcionais (possibilita deletar senha) */
  IRequest): Promise<Partial<User>> {
    /** Busca instancia no repositorio */
    const user: Partial<User> | undefined = await this.usersRepository.findById(
      user_id,
    );

    /** Se nao encontrar, retorna erro */
    if (!user) {
      throw new AppError('User not found');
    }

    /** Deleta hash da senha */
    delete user.password;

    /** Retorna usuario sem senha */
    return user;
  }
}
