const check = require('check-types');
const { ClientLowLevel } = require('./clientLowLevel.js');
const { Router } = require('@authless/core');
const { Cache } = require('./cache');
const debug = require('./debug').extend('high');
const VError = require('verror');

const convertToRouterURL = url => {
  const regex = /http:\/|https:\//gum;
  return url.replace(regex, '');
}

class Client {
  /*
   * lowLevelClient: lowLevelClient instance
   * retries: how many times it should be retried
   * router: Router
   * cache: {
   *  existsFn: a function that checks if it exists (takes url as input)
   *  retrieveFn: a function that retrieves from the cache (takes url as input)
   *  removeFn: a function that removes it from the cache (takes url as input)
   * }
   */
  constructor (params) {
    try {
      check.assert.instance(params.lowLevelClient, ClientLowLevel);
      check.assert.number(params.retries);
      check.assert.instance(params.router, Router);
      check.assert(check.any([
        check.undefined(params.cache),
        check.instance(params.cache, Cache)
      ]), 'expected params.cache to either be undefined or be a Cache instance');
      Object.assign(this, params);
    } catch (e) {
      throw new VError(e, 'failed to initialize Client');
    }
  }

  async $extract (data) {
    const route = this.router.find('GET', convertToRouterURL(data.main.url));
    if (route) {
      const service = route.handler();
      // TODO: this should be part of the service
      if (data.main.url.includes('linkedin.com/authwall')) {
        throw new Error('content mining failed; was unauthenticated');
      }
      if (service.extract) {
        return service.extract(data);
      }
    }
    return data;
  }

  static $isValidCache (data) {
    const isLowLevelData = data => {
      if (check.object(data)) {
        const keys = Object.keys(data);
        return JSON.stringify(['meta', 'content', 'page', 'xhrs', 'main']) ===
          JSON.stringify(keys)
      }
      return false
    }
    return !isLowLevelData(data);
  }

  async url (params, retryCounter = 0) {
    debug.extend('url')(params.u);
    let data = {};
    let extracted = {};
    if (this.cache) {
      data = await this.cache.check(params.u);
      if (data) {
        const cacheValid = Client.$isValidCache(data);
        if (cacheValid) return data;
        await this.cache.remove(params.u);
      }
    }
    // TODO: refactor together with low-level into retry functions
    try {
      data = await this.lowLevelClient.url(params);
      extracted = data;
      try {
        extracted = await this.$extract(data);
      } catch (e) {
        // log the error
        console.log(e);
        if (this.lowLevelClient.cache) {
          await this.lowLevelClient.cache.remove(params.u);
        }
        if (retryCounter < this.retries) {
          debug.extend('url').extend('error')(`retry/invalid lowLevel data: ${e.message}`);
          return this.url(params, retryCounter + 1);
        }
        debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`);
        throw new VError(e, `failed to execute url; retried ${this.retries} times`);
      }
      if (this.cache) {
        await this.cache.write(params.u, extracted);
      }
      return extracted;
    } catch (e) {
      if (retryCounter < this.retries) {
        debug.extend('url').extend('error')(`retry/${retryCounter + 1}: ${e.message}`);
        return this.url(params, retryCounter + 1);
      }
      debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`);
      throw e;
    }
  }
}

module.exports = { Client };
