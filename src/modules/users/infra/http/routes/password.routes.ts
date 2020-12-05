import { Router } from 'express';

/** Importa controller */
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

/** Cria roteador */
const passwordRouter = Router();

/** Instancia controller */
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

/** Escuta método post na rota raiz (/) e responde com objeto json */
passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

/** Exporta roteador de agendamentos */
export default passwordRouter;
