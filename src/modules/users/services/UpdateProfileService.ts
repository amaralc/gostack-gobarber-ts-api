import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: /** Define retorno como usuario com atributos opcionais (possibilita deletar senha) */
  IRequest): Promise<Partial<User>> {
    /** Busca instancia no repositorio */
    const user = await this.usersRepository.findById(user_id);

    /** Se nao encontrar, retorna erro */
    if (!user) {
      throw new AppError('User not found');
    }

    /** Busca usuario por email */
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    /** Se usuario encontrado a partir do email for diferente do atual, retorna erro */
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Email already in use');
    }

    /** Atualiza nome e email */
    user.name = name;
    user.email = email;

    /** Se password foi informado sem old password, retorna erro */
    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set the new password',
      );
    }

    /** Atualiza password caso tenha sido enviado */
    if (password && old_password) {
      /** Avalia se old password confere */
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      /** Se old password nao conferir, retorna erro */
      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      /** Gera hash do password e adiciona ao usuario */
      user.password = await this.hashProvider.generateHash(password);
    }

    /** Salva dados do usuario */
    const updatedUser = await this.usersRepository.save(user);

    /** User without password */
    const updatedSecuredUser: Partial<User> = updatedUser;

    /** Deleta password antes de retornar requisicao */
    delete updatedSecuredUser.password;

    /** Retorna usuario */
    return updatedSecuredUser;
  }
}
