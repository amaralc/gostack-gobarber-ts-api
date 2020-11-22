import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: /** Define retorno como usuario com atributos opcionais (possibilita deletar senha) */
  IRequest): Promise<Partial<User>> {
    /** Busca instancia no banco e retorna instancia ou undefined */
    const user = await this.usersRepository.findById(user_id);

    /** Se nao encontrou, retorna erro */
    if (!user) {
      /** Retorna erro status 401 */
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    /** Se usuario ja tinha avatar, deleta avatar */
    if (user.avatar) {
      /** Deleta arquivo */
      await this.storageProvider.deleteFile(user.avatar);
    }

    /** Salva novo avatar */
    const filename = await this.storageProvider.saveFile(avatarFilename);

    /** Define novo filename do avatar do usuario */
    user.avatar = filename;

    /** Salva alteracoes no banco de dados */
    await this.usersRepository.save(user);

    /** Retorna usuario */
    return user;
  }
}
