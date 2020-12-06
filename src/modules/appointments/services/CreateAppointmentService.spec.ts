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
    /** Executa serviço */
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123123',
    });

    /** Avalia resultado */
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    /** Define parametro */
    const appointmentDate = new Date();

    /** Executa serviço */
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
    });

    /** Executa serviço novamente para gerar erro */
    const appointmentOnSameTime = createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
    });

    /** Avalia resultado */
    await expect(appointmentOnSameTime).rejects.toBeInstanceOf(AppError);
  });
});
