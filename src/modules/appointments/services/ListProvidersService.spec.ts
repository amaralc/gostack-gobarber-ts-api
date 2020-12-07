import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();

    /** Instancia servico passando repositorio como dependencia */
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers except the one creating the request', async () => {
    /** Cria usuarios */
    const user1 = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'User Two',
      email: 'user2@email.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'User Three',
      email: 'user3@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    /** Avalia resultado */
    expect(providers).toEqual([user1, user2]);
  });
});
