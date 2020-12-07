import { getRepository, Repository, Not } from 'typeorm';

/** Importa interface */
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

/** Cria classe implementando interface que permite troca de dependencias */
class UsersRepository implements IUsersRepository {
  /** Define variável e tipagem */
  private ormRepository: Repository<User>;

  constructor() {
    /** Define ormRepository como repositório de User */
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user;
  }

  /** Método para criar appointment */
  public async create(userData: ICreateUserDTO): Promise<User> {
    /** Cria novo instância */
    const user = this.ormRepository.create(userData);

    /** Salva instância no banco de dados */
    await this.ormRepository.save(user);

    /** Retorna instância criada */
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }
}

export default UsersRepository;
