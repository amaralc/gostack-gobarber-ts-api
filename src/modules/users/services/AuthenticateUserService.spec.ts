import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    /** Instancia servicos passando fakes como dependencias */
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate the user', async () => {
    /** Cria usuario */
    const user = await createUser.execute({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço de autenticacao */
    const response = await authenticateUser.execute({
      email: 'user1@email.com',
      password: '123456',
    });

    /** Avalia resultado */
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    /** Executa serviço */
    const authenticateWithNonExistingUser = authenticateUser.execute({
      email: 'user1@email.com',
      password: '123456',
    });

    /** Avalia resultado */
    await expect(authenticateWithNonExistingUser).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to authenticate user with wrong password', async () => {
    /** Cria usuario */
    await createUser.execute({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço de autenticacao */
    const authenticateWithWrongPassword = authenticateUser.execute({
      email: 'user1@email.com',
      password: 'wrong-password',
    });

    /** Avalia resultado */
    await expect(authenticateWithWrongPassword).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
