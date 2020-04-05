const axios = require('axios');
const check = require('check-types');
const debug = require('./debug').extend('low');
const { Cache } = require('./cache.js');
const VError = require('verror');

class ClientLowLevel {
  /*
   * retries: how many times it should be retried
   * uri: authless server uri
   * cache: {
   *  existsFn: a function that checks if it exists (takes url as input)
   *  retrieveFn: a function that retrieves from the cache (takes url as input)
   *  removeFn: a function that removes it from the cache (takes url as input)
   * }
   */
  constructor (params) {
    try {
      check.assert.number(params.retries, 'expected params.retries to be a number');
      check.assert.string(params.uri, 'expected params.uri to be a URI string');
      check.assert(check.any([
        check.undefined(params.cache),
        check.instance(params.cache, Cache)
      ]), 'expected params.cache to either be undefined or be a Cache instance');
      this.axios = axios;
      Object.assign(this, params);
    } catch (e) {
      throw new VError(e, 'failed to initialize ClientLowLevel');
    }
  }

  async url (params, retryCounter = 0) {
    debug.extend('url')(params.u);
    if (!params.responseFormat) params.responseFormat = 'json';
    /* eslint-disable-next-line no-ternary */
    let cacheResult = this.cache
      ? await this.cache.check(params.u)
      : false
    if (cacheResult) return cacheResult;
    try {
      const data = await this.axios.get(`${this.uri}/url`, {params}).
        then(response => response.data);
      if (this.cache) {
        await this.cache.write(params.u, data);
      }
      return data;
    } catch (e) {
      if (retryCounter < this.retries) {
        debug.extend('url').extend('error')(`retry/${retryCounter + 1}: ${e.message}`);
        return this.url(params, retryCounter + 1);
      }
      debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`);
      throw e;
    }
  }

  async search (params) {
    debug.extend('search')(params.q);
    if (!params.responseFormat) params.responseFormat = 'json';
    return this.axios.get(`${this.uri}/search`, {params}).
      then(response => response.data);
  }
}

module.exports = { ClientLowLevel };
