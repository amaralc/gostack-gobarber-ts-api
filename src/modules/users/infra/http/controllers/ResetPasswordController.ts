import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    /** Salva dados da requisicao */
    const { password, token } = request.body;

    /** Instancia servico */
    const resetPassword = container.resolve(ResetPasswordService);

    /** Executa servico e retorna dados relevantes */
    await resetPassword.execute({
      token,
      password,
    });

    /** Retorna usuario criado */
    return response.status(204).json();
  }
}
