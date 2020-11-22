import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UsersAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    /** Instancia servico */
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    /** Executa servico de atualizacao do avatar e retorna usuario */
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    /** Deleta password do usuario */
    delete user.password;

    /** Retorna mensagem de teste */
    return response.status(200).json(user);
  }
}
