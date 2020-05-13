import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import ensureAuthenticate from '../middleware/ensureAuthenticate';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);
const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();

  return response.json(users);
});

/**
 * Routes's responsibilities:
 *  - receive data from request;
 *  - pass data to service deal with it;
 *  - receive response from service;
 *  - return response
 * */
usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService(); // call service with business logic

    const user = await createUserService.execute({
      name,
      email,
      password,
    }); // execute service and get response

    delete user.password;

    return response.json(user); // return response
  } catch (err) {
    return response.status(400).json({ errorMessage: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticate,
  upload.single('avatar'),
  async (request, response) => {
    // console.log(request.file);
    return response.json({ ok: true });
  },
);

export default usersRouter;
