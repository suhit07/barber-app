import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/implementations/FakeCacheProvider';
import ListProviderAppointmentsService from '../ListProviderAppointmentsService';

export default function makeListProviderAppointmentsService(): ListProviderAppointmentsService {
  const appointmentsRepository = new AppointmentsRepository();
  const cacheProvider = new FakeCacheProvider();

  return new ListProviderAppointmentsService(
    appointmentsRepository,
    cacheProvider,
  );
}
