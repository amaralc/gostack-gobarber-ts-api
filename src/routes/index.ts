import { Router } from 'express';
import appointmentsRouter from './appointments.routes';

/** Cria roteador */
const routes = Router();

/** Usa appointmentsRouter para qualquer rota que inicia com /appointments */
routes.use('/appointments', appointmentsRouter);

export default routes;
