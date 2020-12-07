import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    /** Instancia servico passando repositorio como dependencia */
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability of a provider', async () => {
    /** Cria agendamentos */
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    /** Lista disponibilidade */
    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider-id',
      year: 2020,
      month: 5,
      day: 20,
    });

    /** Avalia resultados */
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
