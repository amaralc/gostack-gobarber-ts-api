import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

/** Importa controller */
import SessionsController from '../controllers/SessionsController';

/** Cria roteador */
const sessionsRouter = Router();

/** Instancia controller */
const sessionsController = new SessionsController();

/** Escuta método post na rota raiz (/) e responde com objeto json */
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

/** Exporta roteador de agendamentos */
export default sessionsRouter;
