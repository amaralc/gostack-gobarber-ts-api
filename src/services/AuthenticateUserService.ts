import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

/**
 * Define Response com todas as propriedades configuradas como opcionais
 * Motivo: Permitir que informacoes sejam deletadas na rota que as usa (ex.: password)
 * Ref: https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
interface Response {
  user: Partial<User>;
  token: string;
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

    /**
     * Define token utilizando o sign do jsonwebtoken.
     * ATENCAO: Nao colocar informacoes sensiveis
     */
    const token = sign({}, 'bbbbbfec5c7a007ecd13caf55c6a4d6e', {
      /** Id do usuario */
      subject: user.id,
      /**
       * Tempo de expiracao
       * Ref: avaliar etrategia de 'refresh token'
       */
      expiresIn: '1d',
    });

    /** Se passou por todas as validacoes retorna resposta */
    return {
      user,
      token,
    };
  }
}
