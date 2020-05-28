/* eslint-env node, jest */
import * as VError from 'verror'
import { Cache } from '../src'

describe('Cache', () => {
  describe('constructor', () => {
    describe('valid', () => {
      test('returns proper cache instance', () => {
        let cache = new Cache({
          name: 'test',
          existsFn: async (url: string) => true,
          storeFn: (url: string, data: object) => {
            return {}
          },
          retrieveFn: (url: string) => {
            return {}
          },
          removeFn: (url: string) => {
            return {}
          },
        })
        expect(cache.name).toBe('test')
        expect(cache.existsFn).toBeInstanceOf(Function)
        expect(cache.retrieveFn).toBeInstanceOf(Function)
        expect(cache.storeFn).toBeInstanceOf(Function)
        expect(cache.removeFn).toBeInstanceOf(Function)
        expect(cache.debug).toBeInstanceOf(Function)
      })
    })

    describe('invalid', () => {
      test('throws', () => {
        const config: any = {}
        expect(() => new Cache(config)).toThrowError(VError)
      })
    })
  })
})
