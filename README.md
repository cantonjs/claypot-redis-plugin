# claypot-redis-plugin

[![Build Status](https://travis-ci.org/cantonjs/claypot-redis-plugin.svg?branch=master)](https://travis-ci.org/cantonjs/claypot-redis-plugin)

## Installing

```bash
$ yarn add claypot claypot-redis-plugin
```

## Usage

**Claypotfile.js**

```js
module.exports = {
  plugins: ['claypot-redis-plugin'],
  dbs: {
    foo: {
      store: 'redis',
      keyPrefix: 'my_app',
      cache: {
        ttl: '1 day',
      },
    },
  },
};
```

## License

MIT
