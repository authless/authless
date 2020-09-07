import * as VError from 'verror'
import axios, { AxiosStatic } from 'axios'
import Debug from './debug'

const debug = Debug.extend('client')

interface Config {
  serverUri: string
  retries: number
  axios?: AxiosStatic
}

interface UrlParams {
  url: string
  referer?: string
  responseFormat?: string
}

class Client {
  serverUri: string
  retries: number
  axios: AxiosStatic

  static isValidConfig (x: any): x is Config {
    if(!(x instanceof Object) || x === null) throw new Error('config must be a javascript object')
    if(typeof x.serverUri !== 'string') throw new Error('config.serverUri must be a string')
    if(typeof x.retries !== 'number') throw new Error('config.retries must be a number')
    return true
  }

  constructor (config: Config) {
    try {
      if (Client.isValidConfig(config)) {
        this.serverUri = config.serverUri
        this.retries = config.retries
        this.axios = config.axios ?? axios
      }
      Object.assign(this, config)
    } catch (e) {
      throw new VError(e, 'failed to initialize Client')
    }
  }

  async url (params: UrlParams, retryCounter = 0): Promise<any> {
    debug.extend('url')(params.url)
    params.responseFormat = params.responseFormat ?? 'json'

    try {
      const data = await this.axios.get(`${this.serverUri}/url`, {params})
        .then(response => response.data)
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

}

export { Client }
