import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    /** Instancia repositorio */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    /** Instancia servico passando repositorio como dependencia */
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    /** Executa serviço */
    const user = await createUser.execute({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Avalia resultado */
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('user1@email.com');
  });

  it('should not be able to create a new user with same email of another user', async () => {
    /** Instancia repositorio */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    /** Instancia servico passando repositorio como dependencia */
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    /** Executa serviço */
    await createUser.execute({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço novamente para gerar erro */
    const userWithRepeatedEmail = createUser.execute({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Avalia resultado */
    expect(userWithRepeatedEmail).rejects.toBeInstanceOf(AppError);
  });
});
