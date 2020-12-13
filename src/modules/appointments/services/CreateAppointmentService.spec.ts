import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

/** Define variaveis que serao utilizadas nos testes */
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  /** Inicializa variaveis que serao utilizadas em todos os testes */
  beforeEach(() => {
    /** Instancia dependencias */
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    /** Instancia servico passando dependencias */
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    /** Define variaveis locais para teste */
    const providerId = 'provider-id';
    const userId = 'user-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 10;
    const HH = 12;

    /** Espiona funcao e cria mock com data definida */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(YYYY, MM, DD, HH).getTime();
    });

    /** Executa serviço */
    const appointment = await createAppointment.execute({
      date: new Date(YYYY, MM, DD, HH + 1),
      provider_id: providerId,
      user_id: userId,
    });

    /** Avalia resultado */
    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe(providerId);
  });

  it('should not be able to create two appointments on the same time', async () => {
    /** Define variaveis locais para teste */
    const providerId = 'provider-id';
    const userId = 'user-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 10;
    const HH = 12;

    /** Espiona funcao e cria mock com data definida */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(YYYY, MM, DD, HH).getTime();
    });

    const appointmentDate = new Date(YYYY, MM, DD, HH + 1);

    /** Executa serviço */
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: providerId,
      user_id: userId,
    });

    /** Executa serviço novamente para gerar erro */
    const appointmentOnSameTime = createAppointment.execute({
      date: appointmentDate,
      provider_id: providerId,
      user_id: userId,
    });

    /** Avalia resultado */
    await expect(appointmentOnSameTime).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in a past date', async () => {
    /** Define variaveis locais para teste */
    const providerId = 'provider-id';
    const userId = 'user-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 10;
    const HH = 12;

    /** Espiona funcao e cria mock com data definida */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(YYYY, MM, DD, HH).getTime();
    });

    /** Executa serviço novamente para gerar erro */
    const appointmentOnPastDate = createAppointment.execute({
      date: new Date(YYYY, MM, DD, HH - 1),
      provider_id: providerId,
      user_id: userId,
    });

    /** Avalia resultado */
    await expect(appointmentOnPastDate).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with user_id equal to provider_id', async () => {
    /** Define variaveis locais para teste */
    const providerId = 'id';
    const userId = 'id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 10;
    const HH = 12;

    /** Espiona funcao e cria mock com data definida */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(YYYY, MM, DD, HH).getTime();
    });

    /** Executa serviço */
    const appointmentWithSameUser = createAppointment.execute({
      date: new Date(YYYY, MM, DD, HH + 1),
      provider_id: providerId,
      user_id: userId,
    });

    /** Avalia resultado */
    await expect(appointmentWithSameUser).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am nor after 5pm', async () => {
    /** Define variaveis locais para teste */
    const providerId = 'provider-id';
    const userId = 'user-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 10;
    const HH = 6;

    /** Espiona funcao e cria mock com data definida */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(YYYY, MM, DD, HH).getTime();
    });

    /** Cria agendamento antes do horario permitido */
    const appointmentEarlierThanPossible = createAppointment.execute({
      date: new Date(YYYY, MM, DD, HH + 1),
      provider_id: providerId,
      user_id: userId,
    });

    /** Executa serviço novamente para gerar erro */
    const appointmentLaterthanPossible = createAppointment.execute({
      date: new Date(YYYY, MM, DD, HH + 12),
      provider_id: providerId,
      user_id: userId,
    });

    /** Avalia resultado */
    await expect(appointmentEarlierThanPossible).rejects.toBeInstanceOf(
      AppError,
    );
    await expect(appointmentLaterthanPossible).rejects.toBeInstanceOf(AppError);
  });
});
