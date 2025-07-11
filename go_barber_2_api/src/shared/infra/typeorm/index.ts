import mongoose from 'mongoose';
import { container } from 'tsyringe';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bhumi:bhumi123123@bhumi.yfdsvwk.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);
