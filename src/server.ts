/** Importa express */
import express from 'express';
import routes from './routes';

/** Define app como o retorno da função express() */
const app = express();

/** Escuta método get na rota raiz (/) e responde com objeto json */
app.get('/', (request, response) => response.json({ message: 'Hello World' }));

/** Inicializa app na porta 3333 */
app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
