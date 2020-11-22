import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

/**
 * Define Response com todas as propriedades configuradas como opcionais
 * Motivo: Permitir que informacoes sejam deletadas na rota que as usa (ex.: password)
 * Ref: https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
interface IResponse {
  user: Partial<User>;
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    /** Busca instancia no banco de dados passando email */
    const user = await this.usersRepository.findByEmail(email);

    /** Se instancia nao for encontrada, retorna erro */
    if (!user) {
      /** Retorna erro 401 (nao autorizado) */
      throw new AppError('Incorrect combination of email and password', 401);
    }

    /** Define variavel booleana de comparacao de senha com hash da senha armazenado */
    const passwordMatched = await compare(password, user.password);

    /** Se informacoes nao forem compativeis retorna erro */
    if (!passwordMatched) {
      /** Retorna erro 401 (nao autorizado) */
      throw new AppError('Incorrect combination of email and password', 401);
    }

    /** Desestrutura secret e expiresIn de dentro de authConfig.jwt */
    const { secret, expiresIn } = authConfig.jwt;

    /**
     * Define token utilizando o sign do jsonwebtoken.
     * ATENCAO: Nao colocar informacoes sensiveis
     */
    const token = sign({}, secret, {
      /** Id do usuario */
      subject: user.id,
      /**
       * Tempo de expiracao
       * Ref: avaliar etrategia de 'refresh token'
       */
      expiresIn,
    });

    /** Se passou por todas as validacoes retorna resposta */
    return {
      user,
      token,
    };
  }
}
