import * as VError from 'verror'
import { Cache } from './cache'
import { ClientLowLevel } from './clientLowLevel'
import Debug from './debug'
const debug = Debug.extend('high')

interface Config {
  cache?: Cache
  retries: number
  lowLevelClient: ClientLowLevel
}

interface Data {
  main: {
    url: string
  }
}

class Client {

  cache: Cache | null
  retries: number
  lowLevelClient: ClientLowLevel

  static isValidConfig (x: any): x is Config {
    if(!(x instanceof Object)) throw new Error('config must be a javascript object')
    if(typeof x.retries !== 'number') throw new Error('config.retries must be a number')
    if(!(x.lowLevelClient instanceof ClientLowLevel)) throw new Error('config.lowLevelClient must be a ClientLowLevel')
    if(typeof x.cache !== 'undefined' && !(x.cache instanceof Cache)) {
      throw new Error('config.cache must be undefined or a Cache')
    }
    return true
  }

  /**
   * lowLevelClient: lowLevelClient instance
   *
   * @remarks
   * retries: how many times it should be retried
   * router: Router
   * cache: {
   *  existsFn: a function that checks if it exists (takes url as input)
   *  retrieveFn: a function that retrieves from the cache (takes url as input)
   *  removeFn: a function that removes it from the cache (takes url as input)
   * }
  */
  constructor (config: Config) {
    try {
      if(Client.isValidConfig(config)) {
        this.cache = config.cache
        this.retries = config.retries
        this.lowLevelClient = config.lowLevelClient
      }
    } catch (e) {
      throw new VError(e, 'failed to initialize Client')
    }
  }

  static $isValidCache (data: {}): boolean {
    const isLowLevelData = (data: {}): boolean => {
      if (data instanceof Object) {
        const keys = Object.keys(data)
        return JSON.stringify(['meta', 'content', 'page', 'xhrs', 'main']) ===
          JSON.stringify(keys)
      }
      return false
    }
    return !isLowLevelData(data)
  }

  async url (params: { url: any }, retryCounter = 0): Promise<object | boolean> {
    debug.extend('url')(params.url)
    let data: Object | boolean = false
    if (typeof this.cache !== 'undefined') {
      data = await this.cache.check(params.url)
      if (data !== false) {
        const cacheValid = Client.$isValidCache(data)
        if (cacheValid) return data
        await this.cache.remove(params.url)
      }
    }
    // eslint-disable-next-line no-warning-comments
    // TODO: refactor together with low-level into retry functions
    try {
      data = await this.lowLevelClient.url(params)

      if (data === null || typeof data === 'boolean') {
        // check if an object was returned
        debug.extend('url').extend('error')(`failed to execute url; data was null or boolean: retry count: ${retryCounter}`)
        // throw error and let catch block handle whether to continue or not
        throw new Error('Fetching response')
      } else if (typeof this.cache !== 'undefined') {
        // if an object was returned, save it to cache
        await this.cache.write(params.url, data)
        return data
      }
    } catch (e) {
      // if we are within max retries allowed, call self recursively
      if (retryCounter < this.retries) {
        debug.extend('url').extend('error')(`retry/${retryCounter + 1}: ${e.message as string}`)
        return await this.url(params, retryCounter + 1)
      }

      debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`)
      // remove the data from cache.
      // it will be added when we can successfully get the data from authless-server
      if (typeof this.lowLevelClient.cache !== 'undefined') {
        await this.lowLevelClient.cache.remove(params.url)
      }

      debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`)
      // if we have extinguished max retries allowed, throw an error
      throw new VError(e, `failed to execute url; retried ${this.retries} times`)
    }
  }
}

export { Client }
