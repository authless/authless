/* eslint-env node, jest */
import { Client } from '../src'

describe('Client', () => {
  let authlessClient: Client | null = null

  describe('new', () => {
    test('rejects incorrect constructor config', () => {
      const invalidConfig = {
        serverUri: 'http://example.com:4000',
        retries: 's' as unknown as number,
      }
      expect(() => new Client(invalidConfig)).toThrow()
    })

    test('returns authlessClient instance', () => {
      authlessClient = new Client({
        serverUri: 'http://example.com:4000',
        retries: 1,
      })
      expect(authlessClient).toBeInstanceOf(Client)
    })
  })
})
