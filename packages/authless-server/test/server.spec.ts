import * as common from '@authless/common'
import * as core from '@authless/core'
import { Server } from '../src'
import axios from 'axios'
import http from 'http'

class DefaultDomainPath extends core.DomainPath {

  public async pageHandler (page: any, selectedBot?: any, config?: any): Promise<common.Response> {
    await this.setupPage(page, {})
    const mainResponse = await page.goto(config?.urlParams?.url, {
      timeout: 0,
      waitUntil: 'load'
    })
    return await common.Response.fromPage(selectedBot, page, mainResponse, this.xhrResponses)
  }
}

const createServerInstance = (config: any = {}): Server => {
  const anonBot = new core.AnonBot({
    urls: [],
    browserConfig: {
      useStealthPlugin: true,
    }
  })
  return new Server({
    domainPathRouter: new core.DomainPathRouter({
      '': new DefaultDomainPath('any')
    }),
    botRouter: new core.BotRouter([anonBot]),
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
    const server = createServerInstance()
    const httpServer = await server.run()
    httpServer.close()
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
