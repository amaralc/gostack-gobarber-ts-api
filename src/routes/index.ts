import { Router } from 'express';

const routes = Router();

/** Escuta método get na rota raiz (/) e responde com objeto json */
routes.post('/users', (request, response) => {
  const { name, email } = request.body;

  const user = {
    name,
    email,
  };

  return response.json(user);
});

export default routes;
