
import Redis from 'redis';
import cacheManagerRedisStore from 'cache-manager-redis-store';

export default class RedisClaypotPlugin {
	async connectDB(register) {
		register('redis', ::Redis.createClient, cacheManagerRedisStore);
	}
}
