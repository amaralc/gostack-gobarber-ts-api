import { Router } from 'express';

/** Importa create user service */
import CreateUserService from '../services/CreateUserService';

/** Cria roteador */
const usersRouter = Router();

/** Escuta método post na rota raiz (/) e responde com objeto json */
usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    /** Instancia servico de criacao de usuario */
    const createUser = new CreateUserService();

    /** Cria novo usuario */
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    /** Retorna usuario criado */
    return response.status(200).json(user);

    /** Caso o serviço retorne erro */
  } catch (error) {
    /**
     * Retorna mensagem de erro definida no serviço */
    return response.status(400).json({ error: error.message });
  }
});

/** Exporta roteador de agendamentos */
export default usersRouter;
