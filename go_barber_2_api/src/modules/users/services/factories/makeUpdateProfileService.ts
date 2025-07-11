import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import BCrypHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/implementations/FakeCacheProvider';
import UpdateProfileService from '../UpdateProfileService';

export default function makeUpdateProfileService(): UpdateProfileService {
  const usersRepository = new UsersRepository();
  const hashProvider = new BCrypHashProvider();
  return new UpdateProfileService(usersRepository, hashProvider);
}
