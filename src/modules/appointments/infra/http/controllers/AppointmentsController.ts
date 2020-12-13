import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    /** Busca provider_id e date de dentro do corpo da requisicao */
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    /** Instancia serviço utilizando container de injecao de dependencias */
    const createAppointment = container.resolve(CreateAppointmentService);

    /** Executa serviço (cria appointment) */
    const appointment = await createAppointment.execute({
      date,
      user_id,
      provider_id,
    });

    /** Devolve resposta à requisição */
    return response.json(appointment);
  }
}
