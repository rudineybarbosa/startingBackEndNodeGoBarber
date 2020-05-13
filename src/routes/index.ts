import { Router } from 'express';
import appointementsRouter from './appointments.router';
import usersRouter from './users.router';
import sessionsRouter from './sessions.router';

const routes = Router();

routes.use('/appointments', appointementsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
