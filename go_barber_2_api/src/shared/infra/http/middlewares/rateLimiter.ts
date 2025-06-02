import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import redis from 'redis';

import AppError from '@shared/errors/AppError';
import cacheConfig from '@config/cache';

let limiter: RateLimiterRedis | RateLimiterMemory;

if (cacheConfig.driver === 'fake') {
  limiter = new RateLimiterMemory({
    points: 5,
    duration: 1,
  });
} else {
  const redisClient = redis.createClient({
    url: cacheConfig.redisURL,
  });

  limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 5,
    duration: 1,
  });
}

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch {
    throw new AppError('Too many requests', 429);
  }
}
