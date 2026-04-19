import redis from 'redis';
import config from './env.js';

const redisClient = redis.createClient({
  url: config.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Error:', err.message));
redisClient.on('connect', () => console.log('✓ Redis Connected'));

let redisConnected = false;
try {
  await redisClient.connect();
  redisConnected = true;
} catch (err) {
  console.error('✗ Redis Connection Failed:', err.message);
  console.error('  Scan queue features will be unavailable');
}

export { redisConnected };
export default redisClient;
