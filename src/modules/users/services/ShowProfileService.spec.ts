import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();

    /** Instancia servico passando repositorio como dependencia */
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    /** Avalia resultado */
    expect(profile.name).toBe('User One');
    expect(profile.email).toBe('user1@email.com');
  });

  it('should not be able to show the profile of non-existing user', async () => {
    /** Executa serviço */
    const profile = showProfileService.execute({
      user_id: 'non-existing-user-id',
    });

    /** Avalia resultado */
    await expect(profile).rejects.toBeInstanceOf(AppError);
  });
});
