import { Router } from 'express';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Importa controller */
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

/** Cria roteador de agendamentos */
const providersRouter = Router();

/** Instancia controller */
const providersController = new ProvidersController();

/**
 * Aplica middleware para todas as rotas abaixo desta linha
 * Obs: para usar apenas em uma rota especifica, passamos o middleware como parametro
 * como no exemplo abaixo.
 *
 * appointmentsRouter.get('/', ensureAuthenticated, async (req, res) => {...})
 */
providersRouter.use(ensureAuthenticated);

/** Escuta método post na rota raiz (/) e responde com objeto json */
providersRouter.get('/', providersController.index);

/** Exporta roteador de agendamentos */
export default providersRouter;
