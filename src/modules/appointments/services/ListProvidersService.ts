import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
  }: /** Define retorno como usuario com atributos opcionais (possibilita deletar senha) */
  IRequest): Promise<User[]> {
    /** Busca instancia no repositorio */
    const users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    /** Retorna usuario sem senha */
    return users;
  }
}
