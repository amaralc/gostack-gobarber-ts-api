import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

/** Importa controller */
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

/** Cria roteador */
const passwordRouter = Router();

/** Instancia controller */
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

/** Escuta método post na rota raiz (/) e responde com objeto json */
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

/** Exporta roteador de agendamentos */
export default passwordRouter;
