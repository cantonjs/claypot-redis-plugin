
import Redis from 'redis';
import cacheManagerRedisStore from 'cache-manager-redis-store';

export default class RedisClaypotPlugin {
	constructor(options = {}) {
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
