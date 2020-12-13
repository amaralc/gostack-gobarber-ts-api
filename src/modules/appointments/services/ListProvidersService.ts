import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
  }: /** Define retorno como usuario com atributos opcionais (possibilita deletar senha) */
  IRequest): Promise<User[]> {
    /** Busca usuarios listados na lista deste provider dentro do cache */
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      /** Busca instancia no repositorio */
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      console.log('Query realizada');

      /** Salva */
      await this.cacheProvider.save(`providers-list:${user_id}`, users);
    }

    /** Retorna usuario sem senha */
    return users;
  }
}
