import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

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
      /** Salva path do arquivo */
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      /**
       * Verifica se usuario ja tem avatar utilizando funcao do filesystem em
       * formato de promise ao inves de callback
       */
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      /** Deleta arquivo se ele ja existir */
      if (userAvatarFileExists) {
        /** Deleta arquivo utilizando unlink em formato de promise */
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    /** Define novo filename do avatar do usuario */
    user.avatar = avatarFilename;

    /** Salva alteracoes no banco de dados */
    await this.usersRepository.save(user);

    /** Retorna usuario */
    return user;
  }
}
