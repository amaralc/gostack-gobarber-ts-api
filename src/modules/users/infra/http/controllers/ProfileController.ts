import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    /** Busca id da requisicao */
    const user_id = request.user.id;

    /** Instancia servico */
    const showProfileService = container.resolve(ShowProfileService);

    /** Executa servico */
    const user = await showProfileService.execute({ user_id });

    /** Retorna resultado */
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    /** Busca dados da requisicao */
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    /** Instancia servico */
    const updateProfileService = container.resolve(UpdateProfileService);

    /** Cria novo usuario com todas as propriedades configuradas como opcionais
     * Motivo: Permitir que informacoes sejam deletadas na rota que as usa (ex.: password)
     * Ref: https://www.typescriptlang.org/docs/handbook/utility-types.html
     */
    const user: Partial<ICreateUserDTO> = await updateProfileService.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    /** Retorna usuario criado */
    return response.status(200).json(user);
  }
}
