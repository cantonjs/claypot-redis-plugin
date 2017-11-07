
import Redis from 'ioredis';
import cacheManagerIORedisStore from 'cache-manager-ioredis';

const optionsAdapter = (options = {}) => {
	if (options.prefix) { options.keyPrefix = options.prefix; }
	return options;
};

export default class RedisClaypotPlugin {
	constructor(options = {}) {
		this._name = options.name || 'redis';
		this._matchModel = options.matchModel ||
			((name, key) => (name.toLowerCase() === key.toLowerCase()))
		;
	}

	registerDatabase(register) {
		register(this._name, {
			connect: (options) => {
				return new Redis(optionsAdapter(options));
			},

			createCache: (options) => {
				return {
					...optionsAdapter(options),
					store: cacheManagerIORedisStore,
				};
			},

			createModels: (names, key, options) => {
				if (names.some((name) => this._matchModel(name, key))) {
					return { [key]: new Redis(optionsAdapter(options)) };
				}
			},
		});
	}
}
