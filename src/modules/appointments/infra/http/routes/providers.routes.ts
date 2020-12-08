import { Router } from 'express';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Importa controller */
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

/** Cria roteador de agendamentos */
const providersRouter = Router();

/** Instancia controller */
const providersController = new ProvidersController();
const providerMonthAvailability = new ProviderMonthAvailabilityController();
const providerDayAvailability = new ProviderDayAvailabilityController();

/**
 * Aplica middleware para todas as rotas abaixo desta linha
 * Obs: para usar apenas em uma rota especifica, passamos o middleware como parametro
 * como no exemplo abaixo.
 *
 * appointmentsRouter.get('/', ensureAuthenticated, async (req, res) => {...})
 */
providersRouter.use(ensureAuthenticated);

/** Escuta método get na rota raiz (/) e responde com objeto json */
providersRouter.get('/', providersController.index);

/** Executa restante dos metodos chamando rotas e controllers */
providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailability.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailability.index,
);

/** Exporta roteador de agendamentos */
export default providersRouter;
