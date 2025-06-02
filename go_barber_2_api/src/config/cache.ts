interface IRedisConfig {
  driver: 'redis' | 'fake';
  redisURL?: string;
}

export default {
  driver: process.env.NODE_ENV === 'production' ? 'redis' : 'fake',
  redisURL: process.env.REDIS_URL,
} as IRedisConfig;
