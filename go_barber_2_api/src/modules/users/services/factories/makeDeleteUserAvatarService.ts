import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import uploadConfig from '@config/upload';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import DeleteUserAvatarService from '../DeleteUserAvatarService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/implementations/FakeCacheProvider';

export default function makeDeleteUserAvatarService(): DeleteUserAvatarService {
  const usersRepository = new UsersRepository();
  const cacheProvider = new FakeCacheProvider();
  let storageProvider: IStorageProvider;
  switch (uploadConfig.driver) {
    case 'disk':
      storageProvider = new DiskStorageProvider();
      break;
    case 's3':
      storageProvider = new S3StorageProvider();
      break;
    default:
      storageProvider = new DiskStorageProvider();
  }

  return new DeleteUserAvatarService(
    usersRepository,
    storageProvider,
    cacheProvider,
  );
}
