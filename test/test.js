import claypotRedisPlugin from '../src';
import { startPure } from 'claypot';
import Redis from 'ioredis';

describe('claypot redis plugin', function () {
	let app;

	afterEach(async function () {
		const disconnect = function disconnect(client) {
			if (client && typeof client.disconnect === 'function') {
				client.disconnect();
			}
		};

		if (app) {
			for (const client of Object.values(app.redisClients)) {
				disconnect(client);
			}

			for (const key in app.cacheStores) {
				if (app.cacheStores.hasOwnProperty(key)) {
					const { getClient } = app.cacheStores[key].store;
					if (getClient) {
						disconnect(getClient());
					}
				}
			}

			await app.close();
		}
		app = null;
	});

	test('will create redis cache', async function () {
		app = await startPure({
			plugins: [claypotRedisPlugin],

			dbs: { test: { store: 'redis', cache: {} } },
		});

		expect(app.cache.store.name).toBe('redis');
	});

	test('will extend model', async function () {
		app = await startPure({
			plugins: [claypotRedisPlugin],
			models: 'test/fixtures',
			dbs: { test: { store: 'redis' } },
		});
		const { foo } = app.models;
		expect(foo.constructor.test).toBeInstanceOf(Redis);
	});
});
