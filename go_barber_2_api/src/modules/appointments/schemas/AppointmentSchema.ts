import { Schema, model } from 'mongoose';

interface IAppointment {
  provider_id: string;
  user_id: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  canceled_at?: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  provider_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  canceled_at: {
    type: Date,
    required: false,
  },
});

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema); 