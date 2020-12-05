import { getRepository, Repository } from 'typeorm';

/** Importa interface */
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

/** Importa model (entity) */
import UserToken from '../entities/UserToken';

/** Cria classe implementando interface que permite troca de dependencias */
class UserTokensRepository implements IUserTokensRepository {
  /** Define variável e tipagem */
  private ormRepository: Repository<UserToken>;

  constructor() {
    /** Define ormRepository como repositório de UserToken */
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    /** Encontra com base no token */
    const userToken = await this.ormRepository.findOne({ where: { token } });

    /** Retorna token */
    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    /** Cria token no repositorio */
    const userToken = await this.ormRepository.create({ user_id });

    /** Salva no banco */
    await this.ormRepository.save(userToken);

    /** Retorna token */
    return userToken;
  }
}

export default UserTokensRepository;
