import { AnonBot, BotRouter, DomainPath, DomainPathRouter, Response } from '@authless/core'
import { Server } from '../src'
import axios from 'axios'
import http from 'http'

class DefaultDomainPath extends DomainPath {

  public async pageHandler (page: any, selectedBot?: any, config?: any): Promise<Response> {
    await this.setupPage(page, {})
    const mainResponse = await page.goto(config?.urlParams?.url, {
      timeout: 0,
      waitUntil: 'load'
    })
    return await Response.fromPage(page, { mainResponse, bot: selectedBot, responses: this.responses })
  }
}

const createServerInstance = (config: any = {}): Server => {
  const anonBot = new AnonBot({
    urls: [],
    browserConfig: {
      useStealthPlugin: true,
    }
  })
  return new Server({
    domainPathRouter: new DomainPathRouter({
      '': new DefaultDomainPath('any')
    }),
    botRouter: new BotRouter([anonBot]),
    puppeteerParams: {
      ...{
        headless: false,
        args: [],
        ignoreHTTPSErrors: true
      },
      ...config,
    },
    puppeteerPlugins: [],
  })
}

describe('Server', () => {
  const targetUrl = 'http://www.sanident.it'

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
    const httpServer = await server.run()
    httpServer.close()
  })

  describe('usage (headfull)', () => {
    let serverInstance: Server = {} as any
    let httpServer: http.Server = {} as any

    beforeEach(async () => {
      // start server
      serverInstance = createServerInstance({headless: false})
      httpServer = await serverInstance.run()
    })

    afterEach(() => {
      // stop server
      httpServer.close()
    })

    it('can scrape any page', async () => {
      await axios.get(`http://localhost:3000/url?url=${encodeURIComponent(targetUrl)}`)
    })
  })

  describe('usage (headless)', () => {
    let serverInstance: Server = {} as any
    let httpServer: http.Server = {} as any

    beforeEach(async () => {
      // start server
      //serverInstance = createServerInstance({headless: true, devtools: true})
      serverInstance = createServerInstance({headless: true})
      httpServer = await serverInstance.run()
    })

    afterEach(() => {
      // stop server
      httpServer.close()
    })

    it('can scrape any page', async () => {
      await axios.get(`http://localhost:3000/url?url=${encodeURIComponent(targetUrl)}`)
    })
  })

})
