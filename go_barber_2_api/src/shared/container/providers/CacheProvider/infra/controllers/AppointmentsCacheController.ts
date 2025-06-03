import { Request, Response } from 'express';

import RedisCacheProvider from '../../implementations/RedisCacheProvider';
import FakeCacheProvider from '../../implementations/FakeCacheProvider';

export default class AppointmentsCacheController {
  async destroy(request: Request, response: Response): Promise<Response> {
    const cacheProvider = new FakeCacheProvider();

    await cacheProvider.invalidatePrefix('provider-appointments');

    return response.send();
  }
}
