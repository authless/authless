import * as VError from 'verror'
import Debug from './debug'
import { Debugger } from 'debug'
const debug = Debug.extend('cache')

interface Config {
  name: string
  existsFn: (url: string) => Promise<boolean>
  storeFn: (url: string, data: object) => object
  retrieveFn: (url: string) => object
  removeFn: (url: string) => object
}
class Cache {
  name: string
  debug: Debugger
  existsFn: (url: string) => Promise<boolean>
  storeFn: (url: string, data: object) => object
  retrieveFn: (url: string) => object
  removeFn: (url: string) => object

  static isValidConfig (x: any): x is Config {
    if(!(x instanceof Object)) throw new Error('config must be an object')
    if(typeof x.name !== 'string') throw new Error('config.name must be an string')
    if(!(x.existsFn instanceof Function)) throw new Error('existsFn must be a function')
    if(!(x.retrieveFn instanceof Function)) throw new Error('retrieveFn must be a function')
    if(!(x.storeFn instanceof Function)) throw new Error('storeFn must be a function')
    if(!(x.removeFn instanceof Function)) throw new Error('removeFn must be a function')
    return true
  }

  constructor (config: Config) {
    try {
      if(Cache.isValidConfig(config)) {
        this.name = config.name
        this.existsFn = config.existsFn
        this.retrieveFn = config.retrieveFn
        this.storeFn = config.storeFn
        this.removeFn = config.removeFn
        this.debug = debug.extend(this.name)
      }
    } catch(e) {
      throw new VError(e, 'failed to initialize cache')
    }
  }

  async check (url: string): Promise<object | null> {
    if (await this.existsFn(url)) {
      this.debug.extend('succes')(url)
      return this.retrieveFn(url)
    }
    this.debug.extend('miss')(url)
    return null
  }

  async write (url: string, data: object): Promise<any> {
    this.debug.extend('store')(url)
    return this.storeFn(url, data)
  }

  async remove (url: string): Promise<any> {
    this.debug.extend('remove')(url)
    return this.removeFn(url)
  }
}

export { Cache, Config }
