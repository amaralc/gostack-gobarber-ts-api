import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

/** Define caminho da pasta onde estao serao salvos os arquivos em ambiente local */
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

/** Exporta configuracoes do multer */
export default {
  /** Seleciona local do storage */
  driver: process.env.STORAGE_DRIVER,

  /** Adiciona atributo com caminho do diretorio para ser exportado */
  tmpFolder,
  /** Adiciona caminho adicionando uploads ao final */
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    /** Define tipo de storage */
    storage: multer.diskStorage({
      /** Define destino dos arquivos */
      destination: tmpFolder,
      /** Define nome do arquivo */
      filename(request, file, callback) {
        /** Define hash para identificar o arquivo */
        const fileHash = crypto.randomBytes(10).toString('hex');
        /** Define nome do arquivo */
        const fileName = `${fileHash}-${file.originalname}`;
        /** Retorna callback (ver documentacao do multer) */
        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.BUCKET_NAME,
    },
  },
} as IUploadConfig;
