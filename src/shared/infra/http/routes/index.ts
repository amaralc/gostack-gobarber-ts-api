import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

/** Cria roteador */
const routes = Router();

/** Usa appointmentsRouter para qualquer rota que inicia com /appointments */
routes.use('/appointments', appointmentsRouter);
/** Usa usersRouter para qualquer rota que indicia com /users */
routes.use('/users', usersRouter);
/** Usa sessionsRouters para qualquer rota que indicia com /sessions */
routes.use('/sessions', sessionsRouter);

export default routes;
