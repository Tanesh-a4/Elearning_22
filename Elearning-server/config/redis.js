import { createClient } from 'redis';

// Redis client configuration
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Connection handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis server
async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

// Utility functions
async function getCache(key) {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Error getting ${key} from cache:`, error);
    return null;
  }
}

async function setCache(key, value, expiration = 3600) {
  try {
    return await redisClient.set(key, value, { EX: expiration });
  } catch (error) {
    console.error(`Error setting cache for ${key}:`, error);
  }
}

async function deleteCache(key) {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting cache for ${key}:`, error);
  }
}

export { 
  redisClient, 
  connectRedis, 
  getCache, 
  setCache, 
  deleteCache 
};