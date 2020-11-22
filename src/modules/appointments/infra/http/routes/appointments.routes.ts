import { Router } from 'express';
/**
 * Importa metodos de date-fns
 * parseIso: converte String para objeto Date nativo do JavaScript
 * startOfHour: pega data e coloque minuto, segundo, milisegundos como zero
 */
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Cria roteador de agendamentos */
const appointmentsRouter = Router();

/**
 * Aplica middleware para todas as rotas abaixo desta linha
 * Obs: para usar apenas em uma rota especifica, passamos o middleware como parametro
 * como no exemplo abaixo.
 *
 * appointmentsRouter.get('/', ensureAuthenticated, async (req, res) => {...})
 */
appointmentsRouter.use(ensureAuthenticated);

// /** Escuta método get na rota raiz e retorna todos os agendamentos */
// appointmentsRouter.get('/', async (request, response) => {
//   /** Cria variável para armazenar todos os agendamentos */
//   const appointments = await appointmentsRepository.find();

//   /** Retorna agendamentos */
//   return response.json(appointments);
// });

/** Escuta método post na rota raiz (/) e responde com objeto json */
appointmentsRouter.post('/', async (request, response) => {
  /** Busca provider_id e date de dentro do corpo da requisicao */
  const { provider_id, date } = request.body;

  /** Ajusta formato da data */
  const parsedDate = parseISO(date);

  /** Instancia serviço utilizando container de injecao de dependencias */
  const createAppointment = container.resolve(CreateAppointmentService);

  /** Executa serviço (cria appointment) */
  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  /** Devolve resposta à requisição */
  return response.json(appointment);
});

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
