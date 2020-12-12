import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  /** Define client */
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  /** Salva arquivo */
  public async saveFile(file: string): Promise<string> {
    /** Caminho para arquivo original */
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    /** */
    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    /** Le conteudo do arquivo */
    const fileContent = await fs.promises.readFile(originalPath);

    /** Conecta com aws e salva arquivo */
    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    /** Deleta arquivo da pasta temporaria */
    await fs.promises.unlink(originalPath);

    /** Retorna arquivo */
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);
    try {
      /** Entra no bucket e deleta o arquivo */
      await this.client
        .deleteObject({
          Bucket: 'gostack-gobarber-calil',
          Key: file,
        })
        .promise(); // Transforma em promise para usar o await

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
