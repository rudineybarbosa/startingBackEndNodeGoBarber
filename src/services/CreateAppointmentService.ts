import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repository/AppointmentsRepository';

/**
 * ISP - Interface segregation principle: a lot interface are more flexible than one unique interface
 */
interface RequestDTO {
  providerId: string;

  parsedDate: Date;
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
  public async execute({
    providerId,
    parsedDate,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(parsedDate);

    const appointmentInSameHour = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (appointmentInSameHour) {
      throw Error('Already exists an appointment booked');
    }

    const appointment = appointmentsRepository.create({
      providerId,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
