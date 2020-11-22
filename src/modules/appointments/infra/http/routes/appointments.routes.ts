import { Router } from 'express';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Importa controller */
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

/** Cria roteador de agendamentos */
const appointmentsRouter = Router();

/** Instancia controller */
const appointmentsController = new AppointmentsController();

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
appointmentsRouter.post('/', appointmentsController.create);

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
