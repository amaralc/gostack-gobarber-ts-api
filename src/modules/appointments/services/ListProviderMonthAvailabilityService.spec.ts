import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    /** Instancia servico passando repositorio como dependencia */
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability of a provider', async () => {
    /** Define variaveis locais para utilizar no teste */
    const providerId = 'provider-id';
    const userId = 'user-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 20;
    const HH = 8;

    /** Cria agendamentos */
    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM - 1, DD, HH, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 1, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 2, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 3, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 4, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 5, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 6, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 7, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD + 1, HH, 0, 0),
    });

    /** Lista */
    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: providerId,
      year: YYYY,
      month: MM + 1, // No javascript o mes comeca em zero
    });

    /** Avalia resultados */
    await expect(availability).toEqual(
      await expect.arrayContaining([
        { day: DD - 1, available: true },
        { day: DD + 0, available: false },
        { day: DD + 1, available: true },
        { day: DD + 2, available: true },
      ]),
    );
  });
});
