import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';

import User from '../models/User';

/**
 * ISP - Interface segregation principle: a lot interface are more flexible than one unique interface
 */
interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

/**
 * Principles: SOLID and DRY
 * SRP - Single Responsibility Principle: create appointment
 * OCP - Open/closed principle: easy to be extendable; try avoid changes
 * LSP - Liskov substitution principle: derivated classes can be exchanged by this class
 *
 * DRY - Don't repeat Yourself
 */
class CreateAppointmentService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const userFound = await usersRepository.findOne({
      where: { email },
    });

    if (userFound) {
      throw Error(`Already exists an user with email ${email}`);
    }

    const hashedPassword = await hash(password, 16);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateAppointmentService;
