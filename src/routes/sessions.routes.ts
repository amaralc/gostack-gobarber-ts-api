import { Router } from 'express';

/** Importa service */
import AuthenticateUserService from '../services/AuthenticateUserService';

/** Cria roteador */
const sessionsRouter = Router();

/** Escuta método post na rota raiz (/) e responde com objeto json */
sessionsRouter.post('/', async (request, response) => {
  try {
    /** Salva dados da requisicao */
    const { email, password } = request.body;

    /** Instancia servico */
    const authenticateUser = new AuthenticateUserService();

    /** Autentica usuario e retorna dados relevantes */
    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    /** Deleta dados sensiveis */
    delete user.password;

    /** Retorna usuario criado */
    return response.status(200).json({ user, token });

    /** Caso o serviço retorne erro */
  } catch (error) {
    /** Retorna mensagem de erro definida no serviço */
    return response.status(error.statusCode).json({ error: error.message });
  }
});

/** Exporta roteador de agendamentos */
export default sessionsRouter;
