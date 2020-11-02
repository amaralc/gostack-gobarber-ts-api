/** Importa express */
import express from 'express';
import routes from './routes';

/** Define app como o retorno da função express() */
const app = express();

/** Aplicacao entende formato json */
app.use(express.json());

/** Inicializa rotas */
app.use(routes);

/** Inicializa app na porta 3333 */
app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
