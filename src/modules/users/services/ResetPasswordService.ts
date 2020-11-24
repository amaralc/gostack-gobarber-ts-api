import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    /** Verifica se user token existe e se nao, retorna erro */
    if (!userToken) {
      throw new AppError('User token does not exist');
    }

    /** Define usuario a partir do token */
    const user = await this.usersRepository.findById(userToken.user_id);

    /** Verifica se user existe e se nao, retorna erro */
    if (!user) {
      throw new AppError('User does not exist');
    }

    /** Muda password do usuario */
    user.password = await this.hashProvider.generateHash(password);

    /** Salva alteracao */
    await this.usersRepository.save(user);
  }
}

export default SendForgotPasswordEmailService;
