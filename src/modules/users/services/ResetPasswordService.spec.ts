// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;

let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    /** Instancia servico passando repositorio como dependencia */
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset the password', async () => {
    /** Cria usuário fake */
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

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
    expect(updatedUser?.password).toBe('123123');
  });
});
