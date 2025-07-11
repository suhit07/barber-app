import { classToClass } from 'class-transformer';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

class ListProviderAppointmentsService {
  constructor(
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(request: IRequest): Promise<Appointment[]> {
    const { provider_id, day, month, year } = request;
    // Remove cache logic, just fetch from repository
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({ provider_id, day, month, year });
    return appointments;
  }
}

export default ListProviderAppointmentsService;
