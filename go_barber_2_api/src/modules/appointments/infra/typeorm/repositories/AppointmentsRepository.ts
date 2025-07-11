import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import { Appointment } from '@modules/appointments/schemas/AppointmentSchema';

class AppointmentsRepository implements IAppointmentsRepository {
  public async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<any[]> {
    const { provider_id, day, month, year } = data;
    const startDate = startOfDay(new Date(year, month - 1, day));
    const endDate = endOfDay(new Date(year, month - 1, day));
    return Appointment.find({
      provider_id,
      date: { $gte: startDate, $lte: endDate },
    }).exec();
  }

  public async findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<any[]> {
    const { provider_id, month, year } = data;
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    return Appointment.find({
      provider_id,
      date: { $gte: startDate, $lte: endDate },
    }).exec();
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<any | undefined> {
    return Appointment.findOne({ date, provider_id }).exec();
  }

  public async create(createData: ICreateAppointmentDTO): Promise<any> {
    const appointment = await Appointment.create(createData);
    return appointment;
  }

  public async findAllFutureFromUser(user_id: string): Promise<any[]> {
    const now = new Date();
    return Appointment.find({
      user_id,
      date: { $gte: now },
    }).sort({ date: 1 }).exec();
  }

  public async find(): Promise<any[]> {
    // TODO: Implement actual logic
    return [];
  }

  public async findById(id: string): Promise<any | null> {
    // TODO: Implement actual logic
    return null;
  }

  public async findByUserId(user_id: string): Promise<any[]> {
    // TODO: Implement actual logic
    return [];
  }
}

export default AppointmentsRepository;
