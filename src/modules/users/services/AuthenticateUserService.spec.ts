import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate the user', async () => {
    /** Instancia fakes */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    /** Instancia servicos passando fakes como dependencias */
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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

  // it('should not be able to create a new user with same email of another user', async () => {
  //   /** Instancia repositorio */
  //   const fakeUsersRepository = new FakeUsersRepository();

  //   /** Instancia servico passando repositorio como dependencia */
  //   const createUser = new CreateUserService(fakeUsersRepository);

  //   /** Executa serviço */
  //   await createUser.execute({
  //     name: 'User One',
  //     email: 'user1@email.com',
  //     password: '123456',
  //   });

  //   /** Executa serviço novamente para gerar erro */
  //   const userWithRepeatedEmail = createUser.execute({
  //     name: 'User One',
  //     email: 'user1@email.com',
  //     password: '123456',
  //   });

  //   /** Avalia resultado */
  //   expect(userWithRepeatedEmail).rejects.toBeInstanceOf(AppError);
  // });
});
