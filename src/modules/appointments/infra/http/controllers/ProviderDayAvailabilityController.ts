import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    /** Busca provider_id dentro da requisicao */
    const { year, month, day, provider_id } = request.body;

    /** Instancia serviço utilizando container de injecao de dependencias */
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );

    /** Executa serviço */
    const availability = await listProviderDayAvailabilityService.execute({
      year,
      month,
      day,
      provider_id,
    });

    /** Devolve resposta à requisição */
    return response.json(availability);
  }
}
