import { Router } from 'express';

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
profileRouter.put('/update', profilesController.update);

/** Escuta método get na rota raiz (/) e responde com objeto json */
profileRouter.get('/show', profilesController.show);

/** Exporta roteador de agendamentos */
export default profileRouter;
