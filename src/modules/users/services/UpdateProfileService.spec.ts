import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    /** Instancia fakes */
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    /** Instancia servico passando repositorio como dependencia */
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'User Zero One',
      email: 'user01@email.com',
    });

    /** Avalia resultado */
    await expect(updatedUser.name).toBe('User Zero One');
    await expect(updatedUser.email).toBe('user01@email.com');
  });

  it('should not be able to change email currently used by another user', async () => {
    /** Cria um usuario */
    await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Cria usuario que sera atualizado */
    const user = await fakeUsersRepository.create({
      name: 'User Two',
      email: 'user2@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const updatedUser = updateProfileService.execute({
      user_id: user.id,
      name: 'User One',
      email: 'user1@email.com',
    });

    /** Avalia resultado */
    await expect(updatedUser).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'User Zero One',
      email: 'user01@email.com',
      old_password: '123456',
      password: '123123',
    });

    /** Avalia resultado */
    await expect(updatedUser.name).toBe('User Zero One');
    await expect(updatedUser.email).toBe('user01@email.com');
  });

  it('should not be able to update the password if old password has not been informed', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const updatedUser = updateProfileService.execute({
      user_id: user.id,
      name: 'User Zero One',
      email: 'user01@email.com',
      password: '123123',
    });

    /** Avalia resultado */
    await expect(updatedUser).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password if old password doesnt match', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    const updatedUser = updateProfileService.execute({
      user_id: user.id,
      name: 'User Zero One',
      email: 'user01@email.com',
      old_password: '111111',
      password: '123123',
    });

    /** Avalia resultado */
    await expect(updatedUser).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of non-existing user', async () => {
    /** Executa serviço */
    const user = updateProfileService.execute({
      user_id: 'non-existing-user-id',
      name: 'User Zero One',
      email: 'user01@email.com',
      old_password: '111111',
      password: '123123',
    });

    /** Avalia resultado */
    await expect(user).rejects.toBeInstanceOf(AppError);
  });
});
