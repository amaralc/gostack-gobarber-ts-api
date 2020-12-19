import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

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

    /** Retorna mensagem de teste aplicando classTransforms */
    return response.status(200).json(classToClass(user));
  }
}
