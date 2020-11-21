import { Router } from 'express';

/** Importa service */
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

/** Cria roteador */
const sessionsRouter = Router();

/** Escuta método post na rota raiz (/) e responde com objeto json */
sessionsRouter.post('/', async (request, response) => {
  /** Salva dados da requisicao */
  const { email, password } = request.body;

  /** Instancia repositorio */
  const usersRepository = new UsersRepository();

  /** Instancia servico */
  const authenticateUser = new AuthenticateUserService(usersRepository);

  /** Autentica usuario e retorna dados relevantes */
  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  /** Deleta dados sensiveis */
  delete user.password;

  /** Retorna usuario criado */
  return response.status(200).json({ user, token });
});

/** Exporta roteador de agendamentos */
export default sessionsRouter;
