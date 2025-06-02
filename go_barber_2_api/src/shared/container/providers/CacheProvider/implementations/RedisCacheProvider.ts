import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';
import FakeCacheProvider from './FakeCacheProvider';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface ICacheClient {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}

class RedisCacheProvider implements ICacheProvider {
  private client: ICacheClient;

  constructor() {
    if (cacheConfig.driver === 'fake') {
      this.client = new FakeCacheProvider();
      return;
    }

    try {
      const redisClient = new Redis(cacheConfig.redisURL);
      this.client = {
        async save(key: string, value: any): Promise<void> {
          await redisClient.set(key, JSON.stringify(value));
        },
        async recover<T>(key: string): Promise<T | null> {
          const data = await redisClient.get(key);
          if (!data) return null;
          return JSON.parse(data) as T;
        },
        async invalidate(key: string): Promise<void> {
          await redisClient.del(key);
        },
        async invalidatePrefix(prefix: string): Promise<void> {
          const keys = await redisClient.keys(`${prefix}:*`);
          const pipeline = redisClient.pipeline();
          keys.forEach(key => {
            pipeline.del(key);
          });
          await pipeline.exec();
        },
      };
    } catch (err) {
      console.log("Couldn't connect to Redis: ", { err });
      this.client = new FakeCacheProvider();
    }
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.save(key, value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    return this.client.recover<T>(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    await this.client.invalidatePrefix(prefix);
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.invalidate(key);
  }
}

export default RedisCacheProvider;
