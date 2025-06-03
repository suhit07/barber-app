import BCrypHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/implementations/FakeCacheProvider';
import CreateUserService from '../CreateUserService';

export default function makeCreateUserService(): CreateUserService {
  const usersRepository = new UsersRepository();
  const hashProvider = new BCrypHashProvider();
  const cacheProvider = new FakeCacheProvider();

  return new CreateUserService(usersRepository, hashProvider, cacheProvider);
}
