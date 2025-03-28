import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//   try {
//     await redisClient.connect();
//   } catch (error) {
//     console.error('Redis connection error:', error);
//   }
// })();

export default redisClient;
