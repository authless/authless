import { AnonBot, BotRouter } from '@authless/core'
import { Server } from '../src'

describe('Server', () => {
  it('can start a server', async () => {
    const anonBot = new AnonBot()
    const server = new Server({
      domainPathRouter: {} as any,
      botRouter: new BotRouter([anonBot]),
      puppeteerParams: {
        headless: false
      },
      puppeteerPlugins: [],
    })
    const httpServer = server.run()
    httpServer.close()
  })
})
