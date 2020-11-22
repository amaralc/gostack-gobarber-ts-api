import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Importa controller */
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import UsersController from '@modules/users/infra/http/controllers/UsersController';

/** Cria roteador */
const usersRouter = Router();

/** Instancia controllers */
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

/** Cria instancia do multer para fazer upload */
const upload = multer(uploadConfig);

/** Escuta método post na rota raiz (/) e responde com objeto json */
usersRouter.post('/', usersController.create);

/** Utiliza metodo patch para alterar apenas uma informacao (no caso, o avatar) */
usersRouter.patch(
  '/avatar',
  /** Middleware de autenticacao */
  ensureAuthenticated,
  /** Middleware de upload */
  upload.single('avatar'),
  userAvatarController.update,
);

/** Exporta roteador de agendamentos */
export default usersRouter;
