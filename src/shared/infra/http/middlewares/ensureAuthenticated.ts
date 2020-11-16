import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../../../errors/AppError';
import authConfig from '../../../../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/** Avalia se usuario esta autenticado */
export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  /** Salva header de autenticacao de dentro do header da requisicao */
  const authHeader = request.headers.authorization;

  /** Se nao encontrar o header de autenticacao, retorna erro */
  if (!authHeader) {
    /** Retorna erro status 401 */
    throw new AppError('JWT token is missing', 401);
  }

  /**
   * Formato de desestruturacao: const [type, token]
   * Se nao vamos utilizar uma das informacoes podemos passar: const [, token]
   */
  const [, token] = authHeader.split(' ');

  /** Tenta decodificar token e cria tratativa de erro */
  try {
    /** Decodifica token */
    const decoded = verify(token, authConfig.jwt.secret);

    /** Desestrutura 'decoded' e força tipo da variavel decoded */
    const { sub } = decoded as TokenPayload;

    /**
     * Define valor de propriedade 'user' criada dentro do tipo Request
     * Vide src/@types/express.d.ts
     */
    request.user = {
      id: sub,
    };

    /** Direciona usuario proxima funcao */
    return next();
  } catch (error) {
    /** Retorna erro status 401 */
    throw new AppError('Invalid JWT token', 401);
  }
}
