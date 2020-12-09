import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Importa controller */
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

/** Cria roteador */
const profileRouter = Router();

/** Usa middleware de autenticacao */
profileRouter.use(ensureAuthenticated);

/** Instancia controllers */
const profilesController = new ProfileController();

/** Escuta método post na rota raiz (/) e responde com objeto json */
profileRouter.put(
  '/update',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profilesController.update,
);

/** Escuta método get na rota raiz (/) e responde com objeto json */
profileRouter.get('/show', profilesController.show);

/** Exporta roteador de agendamentos */
export default profileRouter;
