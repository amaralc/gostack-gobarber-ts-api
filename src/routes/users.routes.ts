import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import User from '../models/User';

/** Importa services */
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

/** Cria roteador */
const usersRouter = Router();

/** Cria instancia do multer para fazer upload */
const upload = multer(uploadConfig);

/** Escuta método post na rota raiz (/) e responde com objeto json */
usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    /** Instancia servico de criacao de usuario */
    const createUser = new CreateUserService();

    /** Cria novo usuario com todas as propriedades configuradas como opcionais
     * Motivo: Permitir que informacoes sejam deletadas na rota que as usa (ex.: password)
     * Ref: https://www.typescriptlang.org/docs/handbook/utility-types.html
     */
    const user: Partial<User> = await createUser.execute({
      name,
      email,
      password,
    });

    /** Deleta informação do password da instancia de usuario criada */
    delete user.password;

    /** Retorna usuario criado */
    return response.status(200).json(user);

    /** Caso o serviço retorne erro */
  } catch (error) {
    /** Retorna mensagem de erro definida no serviço */
    return response.status(400).json({ error: error.message });
  }
});

/** Utiliza metodo patch para alterar apenas uma informacao (no caso, o avatar) */
usersRouter.patch(
  '/avatar',
  /** Middleware de autenticacao */
  ensureAuthenticated,
  /** Middleware de upload */
  upload.single('avatar'),
  async (request, response) => {
    try {
      /** Instancia servico */
      const updateUserAvatar = new UpdateUserAvatarService();

      /** Executa servico de atualizacao do avatar e retorna usuario */
      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      /** Deleta password do usuario */
      delete user.password;

      /** Retorna mensagem de teste */
      return response.json(user);
    } catch (error) {
      /** Retorna mensagem de erro definida no serviço */
      return response.status(400).json({ error: error.message });
    }
  },
);

/** Exporta roteador de agendamentos */
export default usersRouter;
