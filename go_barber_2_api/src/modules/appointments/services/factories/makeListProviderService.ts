import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/implementations/FakeCacheProvider';
import ListProvidersService from '../ListProvidersService';

export default function makeListProviderService(): ListProvidersService {
  const usersRepository = new UsersRepository();
  return new ListProvidersService(usersRepository);
}
