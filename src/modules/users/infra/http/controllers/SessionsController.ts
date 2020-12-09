import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

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

    /** Retorna usuario criado alterando conforme regras do class-transformer definidas no model */
    return response.status(200).json({ user: classToClass(user), token });
  }
}
