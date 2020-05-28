import * as VError from 'verror'
import { Router, Service } from '@authless/core'
import { Cache } from './cache'
import { ClientLowLevel } from './clientLowLevel'
import Debug from './debug'
const debug = Debug.extend('high')

const convertToRouterURL = (url: string): string => {
  const regex = /http:\/|https:\//gum
  return url.replace(regex, '')
}

interface Config {
  cache?: Cache
  router: Router
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
  router: Router | null
  retries: number
  lowLevelClient: ClientLowLevel

  static isValidConfig (x: any): x is Config {
    if(!(x instanceof Object)) throw new Error('config must be a javascript object')
    if(!(x.router instanceof Router)) throw new Error('config.router must be a Router')
    if(typeof x.retries !== 'number') throw new Error('config.retries must be a number')
    if(!(x.lowLevelClient instanceof ClientLowLevel)) throw new Error('config.lowLevelClient must be a ClientLowLevel')
    if(typeof x.cache !== 'undefined' && !(x.cache instanceof Cache)) {
      throw new Error('config.cache must be undefined or a Cache')
    }
    return true
  }

  // lowLevelClient: lowLevelClient instance
  // retries: how many times it should be retried
  // router: Router
  // cache: {
  //  existsFn: a function that checks if it exists (takes url as input)
  //  retrieveFn: a function that retrieves from the cache (takes url as input)
  //  removeFn: a function that removes it from the cache (takes url as input)
  // }
  constructor (config: Config) {
    try {
      if(Client.isValidConfig(config)) {
        this.cache = config.cache
        this.router = config.router
        this.retries = config.retries
        this.lowLevelClient = config.lowLevelClient
      }
    } catch (e) {
      throw new VError(e, 'failed to initialize Client')
    }
  }

  async $extract (data: Data): Promise<object> {
    const route: Router = this.router.find('GET', convertToRouterURL(data.main.url))
    if (typeof route !== 'undefined') {
      const service: Service = route.handler()
      // eslint-disable-next-line no-warning-comments
      // TODO: this should be part of the service
      if (data.main.url.includes('linkedin.com/authwall')) {
        throw new Error('content mining failed; was unauthenticated')
      }
      if (service.extract === true) {
        return service.extract(data)
      }
    }
    return data
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

  async url (params: { u: any }, retryCounter = 0): Promise<object | boolean> {
    debug.extend('url')(params.u)
    let data: Object | boolean = false
    let extracted = {}
    if (typeof this.cache !== 'undefined') {
      data = await this.cache.check(params.u)
      if (data !== false) {
        const cacheValid = Client.$isValidCache(data)
        if (cacheValid) return data
        await this.cache.remove(params.u)
      }
    }
    // eslint-disable-next-line no-warning-comments
    // TODO: refactor together with low-level into retry functions
    try {
      data = await this.lowLevelClient.url(params)
      extracted = data
      try {
        extracted = await this.$extract(data as Data)
      } catch (e) {
        // log the error
        console.log(e)
        if (typeof this.lowLevelClient.cache !== 'undefined') {
          await this.lowLevelClient.cache.remove(params.u)
        }
        if (retryCounter < this.retries) {
          debug.extend('url').extend('error')(`retry/invalid lowLevel data: ${e.message as string}`)
          return await this.url(params, retryCounter + 1)
        }
        debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`)
        throw new VError(e, `failed to execute url; retried ${this.retries} times`)
      }
      if (typeof this.cache !== 'undefined') {
        await this.cache.write(params.u, extracted)
      }
      return extracted
    } catch (e) {
      if (retryCounter < this.retries) {
        debug.extend('url').extend('error')(`retry/${retryCounter + 1}: ${e.message as string}`)
        return await this.url(params, retryCounter + 1)
      }
      debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`)
      throw e
    }
  }
}

export { Client }
