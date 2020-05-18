import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import ensureAuthenticate from '../middleware/ensureAuthenticate';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

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
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService(); // call service with business logic

  const user = await createUserService.execute({
    name,
    email,
    password,
  }); // execute service and get response

  delete user.password;

  return response.json(user); // return response
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticate,
  upload.single('avatar'),
  async (request, response) => {
    // console.log(request.file);
    const updateUserAvatarService = new UpdateUserAvatarService();
    const user = await updateUserAvatarService.execute({
      userId: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(user);
  },
);

export default usersRouter;
