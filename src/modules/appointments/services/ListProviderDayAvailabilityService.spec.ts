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
    /** Define variaveis locais para reutilizacao no teste */
    const providerId = 'provider-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 20;
    const HH = 11;

    /** Cria agendamentos */
    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      date: new Date(YYYY, MM, DD, HH + 3, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: providerId,
      date: new Date(YYYY, MM, DD, HH + 4, 0, 0),
    });

    /** Espiona função Date.now e executa minha funcao no lugar dela */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(YYYY, MM, DD, HH).getTime();
    });

    /** Lista disponibilidade */
    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: providerId,
      year: YYYY,
      /** JavaScript comeca em 0 mas nosso service comeca em 1 */
      month: MM + 1,
      day: DD,
    });

    /** Avalia resultados */
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: HH - 3, available: false },
        { hour: HH - 2, available: false },
        { hour: HH - 1, available: false },
        { hour: HH + 2, available: true },
        { hour: HH + 3, available: false },
        { hour: HH + 4, available: false },
        { hour: HH + 5, available: true },
      ]),
    );
  });
});
