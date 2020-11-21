import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

/** Importa entitie de usuario */
import User from '@modules/users/infra/typeorm/entities/User';

/** Importa users repository */
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

/** Importa services */
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

/** Importa middleware de autenticacao */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

/** Cria roteador */
const usersRouter = Router();

/** Cria instancia do multer para fazer upload */
const upload = multer(uploadConfig);

/** Escuta método post na rota raiz (/) e responde com objeto json */
usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    /** Instancia user repository */
    const usersRepository = new UsersRepository();

    /** Instancia servico de criacao de usuario */
    const createUser = new CreateUserService(usersRepository);

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
    /** Instancia user repository */
    const usersRepository = new UsersRepository();

    /** Instancia servico */
    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    /** Executa servico de atualizacao do avatar e retorna usuario */
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    /** Deleta password do usuario */
    delete user.password;

    /** Retorna mensagem de teste */
    return response.status(200).json(user);
  },
);

/** Exporta roteador de agendamentos */
export default usersRouter;
