const check = require('check-types');
const VError = require('verror');
const debug = require('./debug').extend('cache');

class Cache {
  constructor (config) {
    try {
      check.assert.object(config, 'expected param:config to be an object');
      check.assert.string(config.name, 'expected param:name to be a string');
      check.assert.function(config.existsFn, 'expected param:config.existsFn to be a function');
      check.assert.function(config.retrieveFn, 'expected param:config.retrieveFn to be a function');
      check.assert.function(config.storeFn, 'expected param:config.existsFn to be a function');
      check.assert.function(config.removeFn, 'expected param:config.removeFn to be a function');
      Object.assign(this, config);
      this.debug = debug.extend(this.name);
    } catch (e) {
      throw new VError(e, 'failed to initialize cache');
    }
  }

  async check (url) {
    if (await this.existsFn(url)) {
      this.debug.extend('succes')(url);
      return this.retrieveFn(url);
    }
    this.debug.extend('miss')(url);
    return false;
  }

  async write (url, data) {
    this.debug.extend('store')(url);
    return this.storeFn(url, data);
  }

  async remove (url) {
    this.debug.extend('remove')(url);
    return this.removeFn(url);
  }
}

module.exports = { Cache };
