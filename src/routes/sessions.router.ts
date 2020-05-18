import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repository/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.get('/', async (request, response) => {
  // const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  // const appointments = await appointmentsRepository.find();

  return response.json({ message: true });
});

/**
 * Routes's responsibilities:
 *  - receive data from request;
 *  - pass data to service deal with it;
 *  - receive response from service;
 *  - return response
 * */
sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token }); // return response
});

export default sessionsRouter;
