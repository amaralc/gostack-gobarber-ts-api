import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    /** Salva dados da requisicao */
    const { email, password } = request.body;

    /** Instancia servico */
    const authenticateUser = container.resolve(AuthenticateUserService);

    /** Autentica usuario e retorna dados relevantes */
    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    /** Deleta dados sensiveis */
    delete user.password;

    /** Retorna usuario criado */
    return response.status(200).json({ user, token });
  }
}
