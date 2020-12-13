import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    /** Instancia repositorio */
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    /** Instancia servico passando repositorio como dependencia */
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    /** Executa serviço */
    const user = await createUser.execute({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Avalia resultado */
    await expect(user).toHaveProperty('id');
    await expect(user.email).toBe('user1@email.com');
  });

  it('should not be able to create a new user with same email of another user', async () => {
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
    await expect(userWithRepeatedEmail).rejects.toBeInstanceOf(AppError);
  });
});
