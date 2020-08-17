/* eslint-env node, jest */
import { Client, ClientLowLevel } from '../src'

describe('Client', () => {
  let authlessClient: Client | null = null
  let authlessLowLevelClient: ClientLowLevel | null = null
  beforeEach(() => {
    authlessLowLevelClient = new ClientLowLevel({
      retries: 0,
      uri: 'http://example.com:4000',
    })
  })

  describe('new', () => {
    test('returns authlessClient instance', () => {
      authlessClient = new Client({
        lowLevelClient: authlessLowLevelClient,
        retries: 1,
      })
      expect(authlessClient).toBeInstanceOf(Client)
    })
  })
})
