/* eslint-env node, jest */
import { ClientLowLevel } from '../src'

describe('ClientLowLevel', () => {
  let authlessLowLevelClient: ClientLowLevel | null = null
  describe('new', () => {
    it('returns ClientLowLevel instance', () => {
      authlessLowLevelClient = new ClientLowLevel({
        retries: 1,
        uri: 'http://example.com:4000'
      })
      expect(authlessLowLevelClient).toBeInstanceOf(ClientLowLevel)
    })
  })
})
