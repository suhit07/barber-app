import { container } from 'tsyringe';
import ListUserAppointmentsService from '../ListUserAppointmentsService';

export default function makeListUserAppointmentsService(): ListUserAppointmentsService {
  return container.resolve(ListUserAppointmentsService);
} 