import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Importa controller */
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

/** Cria roteador de agendamentos */
const appointmentsRouter = Router();

/** Instancia controllers */
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

/**
 * Aplica middleware para todas as rotas abaixo desta linha
 * Obs: para usar apenas em uma rota especifica, passamos o middleware como parametro
 * como no exemplo abaixo.
 *
 * appointmentsRouter.get('/', ensureAuthenticated, async (req, res) => {...})
 */
appointmentsRouter.use(ensureAuthenticated);

/** Escuta método post na rota raiz (/) e responde com objeto json */
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

/** Escuta outros metodos e aciona controllers */
appointmentsRouter.get('/me', providerAppointmentsController.index);

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
