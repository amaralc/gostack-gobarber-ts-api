import { Request, Response } from 'express';
/**
 * Importa metodos de date-fns
 * parseIso: converte String para objeto Date nativo do JavaScript
 * startOfHour: pega data e coloque minuto, segundo, milisegundos como zero
 */
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    /** Busca provider_id e date de dentro do corpo da requisicao */
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    /** Ajusta formato da data */
    const parsedDate = parseISO(date);

    /** Instancia serviço utilizando container de injecao de dependencias */
    const createAppointment = container.resolve(CreateAppointmentService);

    /** Executa serviço (cria appointment) */
    const appointment = await createAppointment.execute({
      date: parsedDate,
      user_id,
      provider_id,
    });

    /** Devolve resposta à requisição */
    return response.json(appointment);
  }
}
