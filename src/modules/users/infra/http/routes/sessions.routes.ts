import { Router } from 'express';

/** Importa controller */
import SessionsController from '../controllers/SessionsController';

/** Cria roteador */
const sessionsRouter = Router();

/** Instancia controller */
const sessionsController = new SessionsController();

/** Escuta método post na rota raiz (/) e responde com objeto json */
sessionsRouter.post('/', sessionsController.create);

/** Exporta roteador de agendamentos */
export default sessionsRouter;
