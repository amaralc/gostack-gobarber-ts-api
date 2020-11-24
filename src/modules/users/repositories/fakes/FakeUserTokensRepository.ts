import { v4 } from 'uuid';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

/** Cria classe implementando interface que permite troca de dependencias */
class FakeUserTokensRepository implements IUserTokensRepository {
  /** Cria repositorio fake */
  private userTokens: UserToken[] = [];

  /** Metodo para geracao de tokens */
  public async generate(user_id: string): Promise<UserToken> {
    /** Instancia userToken */
    const userToken = new UserToken();

    /** Define valores do token */
    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
    });

    /** Adiciona token à lista fake */
    this.userTokens.push(userToken);

    /** Retorna token gerado */
    return userToken;
  }
}

export default FakeUserTokensRepository;
