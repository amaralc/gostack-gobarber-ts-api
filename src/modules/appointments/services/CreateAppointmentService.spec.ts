import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    /** Instancia repositorio */
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    /** Instancia servico passando repositorio como dependencia */
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

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
    /** Instancia repositorio */
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    /** Instancia servico passando repositorio como dependencia */
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

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
    expect(appointmentOnSameTime).rejects.toBeInstanceOf(AppError);
  });
});
