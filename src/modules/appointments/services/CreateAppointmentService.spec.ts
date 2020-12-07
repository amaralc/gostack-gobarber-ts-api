import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

/** Define variaveis que serao utilizadas nos testes */
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  /** Inicializa variaveis que serao utilizadas em todos os testes */
  beforeEach(() => {
    /** Instancia repositorio */
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    /** Instancia servico passando repositorio como dependencia */
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    /** Define variaveis locais para teste */
    const providerId = 'provider-id';
    const userId = 'user-id';

    /** Executa serviço */
    const appointment = await createAppointment.execute({
      date: new Date(),
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
    const appointmentDate = new Date();

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
});
