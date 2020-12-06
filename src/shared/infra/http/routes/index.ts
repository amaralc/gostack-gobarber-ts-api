import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

/** Cria roteador */
const routes = Router();

/** Usa appointmentsRouter para qualquer rota que inicia com /appointments */
routes.use('/appointments', appointmentsRouter);
/** Usa usersRouter para qualquer rota que indicia com /users */
routes.use('/users', usersRouter);
/** Usa sessionsRouters para qualquer rota que indicia com /sessions */
routes.use('/sessions', sessionsRouter);
/** Usa passwordRouter para qualquer rota que indicia com /password */
routes.use('/password', passwordRouter);
/** Usa profileRouter para qualquer rota que indicia com /profile */
routes.use('/profile', profileRouter);

export default routes;
