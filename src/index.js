
import Redis from 'redis';
import cacheManagerRedisStore from 'cache-manager-redis-store';
import pify from 'pify';

export default class RedisClaypotPlugin {
	constructor(options = {}) {
		pify(Redis.RedisClient.prototype);
		pify(Redis.Multi.prototype);
		this._name = options.name || 'redis';
	}

	registerDatabase(register) {
		register(this._name, {
			connect(options) {
				Redis.createClient(options);
			},
			createCache(options) {
				return {
					...options,
					store: cacheManagerRedisStore,
				};
			},
		});
	}
}
