import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

import User from '../models/User';
import AppError from '../errors/AppError';

interface RequestDTO {
  userId: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: RequestDTO): Promise<User> {
    const userRespository = getRepository(User);

    const user = await userRespository.findOne(userId);

    if (!user) {
      throw new AppError('Only registred user can change avatar', 401);
    }

    if (user.avatar) {
      // delete previous avatar

      const avatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarExists = await fs.promises.stat(avatarFilePath);
      if (userAvatarExists) {
        await fs.promises.unlink(avatarFilePath);
      }

      delete user.password;
    }

    user.avatar = avatarFileName;
    await userRespository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
