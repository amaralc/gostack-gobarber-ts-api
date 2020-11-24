// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
  it('should be able to recover password using the email', async () => {
    /** Instancia repositorio */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    /** Inicializa monitoramento da funcao sendMail do fakeMailProvider */
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    /** Instancia servico passando repositorio como dependencia */
    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    /** Cria usuário fake */
    await fakeUsersRepository.create({
      name: 'User One',
      email: 'email1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    await sendForgotPasswordEmail.execute({
      email: 'user1@email.com',
    });

    /** Avalia resultado */
    expect(sendMail).toHaveBeenCalled();
  });
});
