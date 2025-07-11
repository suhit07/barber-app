import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IRequest {
  user_id: string;
}

@injectable()
class ListUserAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Appointment[]> {
    // Remove cache logic, just fetch from repository
    const appointments = await this.appointmentsRepository.findAllFutureFromUser(user_id);
    return appointments;
  }
}

export default ListUserAppointmentsService; 