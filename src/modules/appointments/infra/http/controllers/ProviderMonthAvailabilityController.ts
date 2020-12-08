import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    /** Busca provider_id dentro da requisicao */
    const { provider_id } = request.params;
    const { year, month } = request.body;

    /** Instancia serviço utilizando container de injecao de dependencias */
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    /** Executa serviço */
    const availability = await listProviderMonthAvailabilityService.execute({
      year,
      month,
      provider_id,
    });

    /** Devolve resposta à requisição */
    return response.json(availability);
  }
}
