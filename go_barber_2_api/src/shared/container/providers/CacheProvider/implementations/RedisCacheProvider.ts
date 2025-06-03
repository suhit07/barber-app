import FakeCacheProvider from '../fakes/FakeCacheProvider';
import ICacheProvider from '../models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private client: ICacheProvider;

  constructor() {
    this.client = new FakeCacheProvider();
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.save(key, value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    return this.client.recover<T>(key);
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.invalidate(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    await this.client.invalidatePrefix(prefix);
  }
}

export default RedisCacheProvider;
