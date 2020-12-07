import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    /** Instancia servico passando repositorio como dependencia */
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password using the email', async () => {
    /** Inicializa monitoramento de funções */
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    /** Cria usuário fake */
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    await sendForgotPasswordEmail.execute({
      email: 'user1@email.com',
    });

    /** Avalia resultado */
    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });

  it('should not be able to recover a non-existing user password', async () => {
    /** Executa serviço */
    const sendEmailToNonExistingUser = sendForgotPasswordEmail.execute({
      email: 'user1@email.com',
    });

    /** Avalia resultado */
    await expect(sendEmailToNonExistingUser).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    /** Executa serviço */
    const sendEmailToNonExistingUser = sendForgotPasswordEmail.execute({
      email: 'user1@email.com',
    });

    /** Avalia resultado */
    await expect(sendEmailToNonExistingUser).rejects.toBeInstanceOf(AppError);
  });
});
