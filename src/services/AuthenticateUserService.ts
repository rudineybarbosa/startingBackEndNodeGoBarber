import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import configAuth from '../config/auth';

import User from '../models/User';
import AppError from '../errors/AppError';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const passworHashed = user.password;
    const hasMatch = await compare(password, passworHashed);

    if (!hasMatch) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const token = sign({}, configAuth.jwt.secret, {
      subject: user.id,
      expiresIn: configAuth.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
