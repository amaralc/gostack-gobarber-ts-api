// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    /** Instancia servico passando repositorio como dependencia */
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    /** Cria usuário fake */
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Monitora funcao */
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    /** Cria token fake */
    const { token } = await fakeUserTokensRepository.generate(user.id);

    /** Executa serviço */
    await resetPassword.execute({
      password: '123123',
      token,
    });

    /** Busca dados completos do usuário */
    const updatedUser = await fakeUsersRepository.findById(user.id);

    /** Avalia resultado */

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });
});
