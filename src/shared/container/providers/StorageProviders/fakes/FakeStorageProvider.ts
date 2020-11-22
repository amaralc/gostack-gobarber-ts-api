import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  /** Salva arquivo */
  public async saveFile(file: string): Promise<string> {
    /** Adiciona string ao array */
    this.storage.push(file);

    /** Retorna arquivo */
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    /** Encontra indice */
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    /** Remove informacao do array */
    this.storage.splice(findIndex, 1);
  }
}
