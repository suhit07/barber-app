import { container } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

// Register Appointments Repository
container.register<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
);