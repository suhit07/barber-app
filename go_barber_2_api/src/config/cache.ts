interface IRedisConfig {
  driver: 'redis' | 'fake';
  redisURL?: string;
}

export default {
  driver: process.env.NODE_ENV === 'production' ? 'redis' : 'fake',
  redisURL: process.env.NODE_ENV === 'production' 
    ? `redis://${process.env.REDIS_PASS ? ':' + process.env.REDIS_PASS + '@' : ''}${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    : process.env.REDIS_URL,
} as IRedisConfig;
