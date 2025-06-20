import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '@modules/appointments/repositories/IAppointmentsRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IRequest {
  user_id: string;
}

@injectable()
class ListUserAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Appointment[]> {
    const cacheKey = `user-appointments:${user_id}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllFutureFromUser(
        user_id,
      );

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}

export default ListUserAppointmentsService; 