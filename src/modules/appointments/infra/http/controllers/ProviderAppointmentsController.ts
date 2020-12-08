import { Request, Response } from 'express';
/**
 * Importa metodos de date-fns
 * parseIso: converte String para objeto Date nativo do JavaScript
 * startOfHour: pega data e coloque minuto, segundo, milisegundos como zero
 */
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    /** Busca provider_id e date de dentro do corpo da requisicao */
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    /** Instancia serviço utilizando container de injecao de dependencias */
    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    /** Executa serviço (cria appointment) */
    const appointments = await listProviderAppointmentsService.execute({
      day,
      month,
      year,
      provider_id,
    });

    /** Devolve resposta à requisição */
    return response.json(appointments);
  }
}
