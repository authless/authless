import * as VError from 'verror'
import axios, { AxiosStatic } from 'axios'
import { Cache } from './cache'
import Debug from './debug'
const debug = Debug.extend('low')

interface Config {
  uri: any
  retries: any
  cache?: Cache
}

interface UrlParams {
  url: string
  referer?: string
  responseFormat?: string
}
interface SearchParams {
  q: string
  responseFormat?: string
}
type ResponseData = object

class ClientLowLevel {

  uri: string
  retries: number
  cache: Cache | null
  axios: AxiosStatic

  static isValidClientLowLevel (x: any): x is ClientLowLevel {
    if(!(x instanceof Object)) throw new Error('config must be a javascript object')
    if(typeof x.uri !== 'string') throw new Error('config.uri must be a string')
    if(typeof x.retries !== 'number') throw new Error('config.retries must be a number')
    if(typeof x.cache !== 'undefined' && !(x.cache instanceof Cache)) {
      throw new Error('config.cache must be undefined or a Cache')
    }
    return true
  }

  // retries: how many times it should be retried
  // uri: authless server uri
  // cache: {
  //  existsFn: a function that checks if it exists (takes url as input)
  //  retrieveFn: a function that retrieves from the cache (takes url as input)
  //  removeFn: a function that removes it from the cache (takes url as input)
  // }
  constructor (config: Config) {
    try {
      if(ClientLowLevel.isValidClientLowLevel(config)) {
        this.uri = config.uri
        this.retries = config.retries
        this.cache = config.cache
        this.axios = axios
      }
      Object.assign(this, config)
    } catch (e) {
      throw new VError(e, 'failed to initialize ClientLowLevel')
    }
  }

  async url (params: UrlParams, retryCounter = 0): Promise<any> {
    debug.extend('url')(params.url)
    params.responseFormat = params.responseFormat ?? 'json'

    let cacheResult = await this.cache?.check(params.url)
    if(cacheResult !== null) {
      return cacheResult
    }
    try {
      const data = await this.axios.get(`${this.uri}/url`, {params})
        .then(response => response.data)
      await this.cache?.write(params.url, data)
      return data
    } catch (e) {
      if (retryCounter < this.retries) {
        debug.extend('url').extend('error')(`retry/${retryCounter + 1}: ${e.message as string}`)
        return this.url(params, retryCounter + 1)
      }
      debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`)
      throw e
    }
  }

  async search (params: SearchParams): Promise<ResponseData> {
    debug.extend('search')(params.q)
    params.responseFormat = params.responseFormat ?? 'json'

    return await this.axios.get(`${this.uri}/search`, {params})
      .then(response => response.data)
  }
}

export { ClientLowLevel }
