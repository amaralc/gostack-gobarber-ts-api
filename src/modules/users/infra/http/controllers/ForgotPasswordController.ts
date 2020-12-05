import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    /** Salva dados da requisicao */
    const { email } = request.body;

    /** Instancia servico */
    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    /** Executa servico e retorna dados relevantes */
    await sendForgotPasswordEmail.execute({
      email,
    });

    /** Retorna usuario criado */
    return response.status(204).json();
  }
}
