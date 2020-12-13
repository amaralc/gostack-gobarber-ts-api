import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    /** Instancia servico passando repositorio como dependencia */
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    /** Define variaveis locais para reutilizacao no teste */
    const providerId = 'provider-id';
    const userId = 'user-id';
    const YYYY = 2020;
    const MM = 4;
    const DD = 20;
    const HH = 13;

    /** Cria agendamentos */
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 1, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: providerId,
      user_id: userId,
      date: new Date(YYYY, MM, DD, HH + 2, 0, 0),
    });

    /** Lista disponibilidade */
    const appointments = await listProviderAppointmentsService.execute({
      provider_id: providerId,
      year: YYYY,
      /** JavaScript comeca em 0 mas nosso service comeca em 1 */
      month: MM + 1,
      day: DD,
    });

    /** Avalia resultados */
    await expect(appointments).toEqual([appointment1, appointment2]);
  });
});
