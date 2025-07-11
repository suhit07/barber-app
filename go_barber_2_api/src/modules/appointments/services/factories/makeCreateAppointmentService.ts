import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import CreateAppointmentService from '../CreateAppointmentService';

export default function makeCreateAppointmentService(): CreateAppointmentService {
  const appointmentsRepository = new AppointmentsRepository();
  const notificationsRepository = new NotificationsRepository();

  return new CreateAppointmentService(
    appointmentsRepository,
    notificationsRepository,
  );
}
