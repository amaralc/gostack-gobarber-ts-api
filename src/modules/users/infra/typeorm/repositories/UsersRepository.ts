import { getRepository, Repository } from 'typeorm';

/** Importa interface */
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateAppointmentDTO from '@modules/users/dtos/ICreateUserDTO';

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
  public async create(userData: ICreateAppointmentDTO): Promise<User> {
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
}

export default UsersRepository;
