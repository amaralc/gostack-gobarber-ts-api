import 'reflect-metadata';
/** Importa express */
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

/**
 * Importa modulo que habilita requisicoes ao backend vindo de outras origens.
 * CORS - Cross-origin resource sharing
 * Essa opcao permite definir quais servidores podem fazer requisicao ao backend
 */
import cors from 'cors';

/** Importa configuracao de upload */
import uploadConfig from '@config/upload';

/** Importa classe de erro */
import AppError from '@shared/errors/AppError';

import routes from './routes';

/** Importa conexão sem passar para nenhuma variável */
import '@shared/infra/typeorm';

/** Define app como o retorno da função express() */
const app = express();

/** Usa cors no na aplicacao */
app.use(cors());

/** Aplicacao entende formato json */
app.use(express.json());

/** Serve arquivos estaticos na rota files */
app.use('/files', express.static(uploadConfig.directory));

/** Inicializa rotas */
app.use(routes);

/** Chama middleware de tratativa dos erros DEPOIS DAS ROTAS */
app.use(
  /** Utiliza _ no ultimo argumento para criar regra no eslint */
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    /**
     * Verifica se erro é instância de AppError.
     * Se sim, significa que foi originado pela minha aplicação
     */
    if (error instanceof AppError) {
      /** Retorna erro ao frontend de forma amigavel */
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    /** Se erro não foi definido na aplicação, retorna erro genérico */
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

/** Inicializa app na porta 3333 */
app.listen(3333, () => {
  console.log('Server started on port 3333!');
});