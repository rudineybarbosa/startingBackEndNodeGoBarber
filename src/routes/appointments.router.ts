import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middleware/ensureAuthenticate';

import AppointmentsRepository from '../repository/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

/**
 * Routes's responsibilities:
 *  - receive data from request;
 *  - pass data to service deal with it;
 *  - receive response from service;
 *  - return response
 * */
appointmentsRouter.post('/', async (request, response) => {
  const { providerId, date } = request.body;

  const parsedDate = parseISO(date); // transform data

  const createAppointmentService = new CreateAppointmentService(); // call service with business logic

  const appointment = await createAppointmentService.execute({
    providerId,
    parsedDate,
  }); // execute service and get response

  return response.json(appointment); // return response
});

export default appointmentsRouter;
