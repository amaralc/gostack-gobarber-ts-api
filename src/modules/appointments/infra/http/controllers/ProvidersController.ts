import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    /** Busca provider_id dentro da requisicao */
    const user_id = request.user.id;

    /** Instancia serviço utilizando container de injecao de dependencias */
    const listProvidersService = container.resolve(ListProvidersService);

    /** Executa serviço (cria appointment) */
    const providers = await listProvidersService.execute({ user_id });

    /** Devolve resposta à requisição */
    return response.json({ providers: classToClass(providers) });
  }
}
