import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create a new user', async () => {
    /** Instancia fakes */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    /** Instancia servico passando repositorio como dependencia */
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    /** Avalia resultado */
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar of non existing user', async () => {
    /** Instancia fakes */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    /** Instancia servico passando repositorio como dependencia */
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    /** Executa serviço */
    const updateNonExistingUser = updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFilename: 'avatar.jpg',
    });

    /** Avalia resultado */
    await expect(updateNonExistingUser).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating avatar of existing user', async () => {
    /** Instancia fakes */
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    /** Monitora função para mais adiante avaliar se foi disparada */
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    /** Instancia servico passando repositorio como dependencia */
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'User One',
      email: 'user1@email.com',
      password: '123456',
    });

    /** Executa serviço */
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    /** Executa serviço novamente para trocar avatar */
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    /** Avalia resultado */
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
