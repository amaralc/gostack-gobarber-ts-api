import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  /** Salva arquivo */
  public async saveFile(file: string): Promise<string> {
    /** Usa filesystem como promise e move arquivo de um lugar para outro */
    await fs.promises.rename(
      /** Origem */
      path.resolve(uploadConfig.tmpFolder, file),
      /** Destino */
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    /** Retorna arquivo */
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);
    try {
      /** Busca informações sobre arquivo e se nao encontrar, retorna erro */
      await fs.promises.stat(filePath);

      /** Caso não encontre o arquivo */
    } catch (error) {
      /** Para função por aqui */
      return;
    }

    /** Se encontrou arquivo, deleta arquivo */
    await fs.promises.unlink(filePath);
  }
}
