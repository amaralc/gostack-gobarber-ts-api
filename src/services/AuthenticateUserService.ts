import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
}

export default class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    /** Define repositorio com acoes padrao usando metodos do typeorm */
    const usersRepository = getRepository(User);

    /** Busca instancia no banco de dados passando email */
    const user = await usersRepository.findOne({ where: { email } });

    /** Se instancia nao for encontrada, retorna erro */
    if (!user) {
      throw new Error('Incorrect combination of email and password');
    }

    /** Define variavel booleana de comparacao de senha com hash da senha armazenado */
    const passwordMatched = await compare(password, user.password);

    /** Se informacoes nao forem compativeis retorna erro */
    if (!passwordMatched) {
      throw new Error('Incorrect combination of email and password');
    }

    /** Se passou por todas as validacoes retorna resposta */
    return {
      user,
    };
  }
}
