import Redis from 'ioredis';
import cacheManagerIORedisStore from 'cache-manager-ioredis';

const optionsAdapter = (options = {}) => {
	if (options.prefix) {
		options.keyPrefix = options.prefix;
	}
	return options;
};

export default class RedisClaypotPlugin {
	constructor(options = {}) {
		this._store = options.store || 'redis';
		this._includeModels = options.includeModels || [];
		this._excludeModels = options.excludeModels || [];
		this._modelNamesMap = {};
		this._injectClients = options.injectClients || 'redisClients';
	}

	willConnectDatabases(dbsMap, app) {
		const clients = {};
		for (const [key, db] of dbsMap) {
			if (db.store === this._store) {
				const config = optionsAdapter(db.config);
				clients[key] = new Redis(config);
			}
		}
		this._clients = app[this._injectClients] = clients;
	}

	willCreateCacheStores(cacheStoresMap) {
		for (const [cacheKey, descriptor] of cacheStoresMap) {
			if (this._clients.hasOwnProperty(cacheKey)) {
				descriptor.store = cacheManagerIORedisStore;
				cacheStoresMap.set(cacheKey, {
					...optionsAdapter(descriptor),
					store: cacheManagerIORedisStore,
				});
			}
		}
	}

	willCreateModels(modelsMap) {
		const includes = this._includeModels;
		const excludes = this._excludeModels;
		const clients = this._clients;
		const namesMap = this._modelNamesMap;

		for (const [name, Model] of modelsMap) {
			const shouldInclude = includes.length && !includes.includes(name);
			if (shouldInclude || excludes.includes(name)) {
				continue;
			}

			for (const key in clients) {
				if (!clients.hasOwnProperty(key)) {
					continue;
				}
				const prop = namesMap[key] || key;
				Model[prop] = clients[key];
			}
		}
	}
}
