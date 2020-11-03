import { Router } from 'express';
import { v4 } from 'uuid';

/** Cria roteador de agendamentos */
const appointmentsRouter = Router();

/** Cria lista de agendamentos */
const appointments = [];

/** Escuta método get na rota raiz (/) e responde com objeto json */
appointmentsRouter.post('/', (request, response) => {
  /** Busca provider e date de dentro do corpo da requisicao */
  const { provider, date } = request.body;

  /** Cria novo appointment */
  const appointment = {
    id: v4(),
    provider,
    date,
  };

  /** Adiciona agendamento à lista de agendamentos */
  appointments.push(appointment);

  /** Adiciona appointment criado na lista de appointments */
  return response.json({ message: 'Hello World' });
});

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
