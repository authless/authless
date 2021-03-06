import * as common from '@authless/common'
import * as core from '@authless/core'
import * as http from 'http'
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { PuppeteerExtraPlugin } from 'puppeteer-extra'
import { v4 as uuidv4 } from 'uuid'

export interface IServerConfig {
  domainPathRouter: core.DomainPathRouter
  botRouter: core.BotRouter
  puppeteerParams: common.PuppeteerParams
  puppeteerPlugins?: PuppeteerExtraPlugin[]
  proxy?: common.ProxyConfig
}

/**
 * Helper class to start your running Authless server
 *
 * @remarks
 * This class can be used to create a configurable puppeteer instance with
 * some built-in functionality and plugins
 *
 * @example
 * ```ts
 * await browser = Server.launchBrowser(myDomainPath, myBot, {puppeteerParams, puppeteerPlugins, ..})
 * await page = browser.newPage()
 *
 * await domainPath.pageHandler(page, ..)
 * ```
 *
 * @beta
 */
export class Server {
  domainPathRouter: core.DomainPathRouter
  botRouter: core.BotRouter
  puppeteerParams?: common.PuppeteerParams
  puppeteerPlugins?: PuppeteerExtraPlugin[]
  proxy?: common.ProxyConfig

  /**
   * Create a Authless server instance
   *
   * @beta
   */
  constructor (config: IServerConfig) {
    this.botRouter = config.botRouter
    this.domainPathRouter = config.domainPathRouter
    this.puppeteerParams = config.puppeteerParams
    this.puppeteerPlugins = config.puppeteerPlugins
    this.proxy = config.proxy
  }

  private static ping (expressRequest: ExpressRequest, expressResponse: ExpressResponse): void {
    const name = expressRequest.query.name ?? 'anonymous user'
    if (typeof name !== 'string') {
      const error = `error: url must be provided as a query parameter string. invalid value: ${name?.toLocaleString() ?? 'undefined'}`
      console.log(error)
      expressResponse
        .status(422)
        .send(error)
        .end()
      return
    }
    expressResponse
      .status(200)
      .send(`hello ${name}`)
      .end()
  }

  private static speedtest (expressRequest: ExpressRequest, expressResponse: ExpressResponse): void {
    // start puppeteer with this.puppeteerParams
    // run speedtest
    expressResponse
      .send(JSON.stringify({'speed': '1000'}))
      .end()
  }

  private async scrape (expressRequest: ExpressRequest, expressResponse: ExpressResponse): Promise<any> {
    try {
      const urlParams = expressRequest.query
      const { url, username } = urlParams

      if (typeof url !== 'string') {
        throw new Error(`url must be provided as a query parameter string. invalid value: ${url?.toLocaleString() ?? 'undefined'}`)
      }

      // try to fetch the sevice for this url
      const selectedDomainPath = this.domainPathRouter.getDomainPath(url)
      if (typeof selectedDomainPath === 'undefined') {
        throw new Error(`no DomainPath handler found for ${url}`)
      }

      // get bot when username not provided explicitly
      let selectedBot = this.botRouter.getBotForUrl(url)
      // get bot when username is provided
      if (typeof username === 'string') {
        selectedBot = this.botRouter.getBotByUsername(username)
        if (selectedBot instanceof core.AnonBot) {
          throw new Error(`unable to find bot with username ${username}`)
        }
      }

      // initialise the browser
      const browser = await selectedBot.launchBrowser({
        puppeteerParams: this.puppeteerParams,
        puppeteerPlugins: this.puppeteerPlugins,
        proxy: this.proxy
      })
      const page = await browser.newPage()

      try {
        if (typeof this.puppeteerParams?.viewPort !== 'undefined') {
          await page.setViewport(this.puppeteerParams?.viewPort)
        }

        let responseFormat: common.URLParams['responseFormat'] = 'json'
        if (urlParams?.responseFormat === 'png') {
          responseFormat = urlParams?.responseFormat
        }
        // let service handle the page
        const authlessResponse = await selectedDomainPath.pageHandler(
          page,
          selectedBot,
          {
            urlParams: { url, responseFormat },
            puppeteerParams: this.puppeteerParams
          }
        )

        if (responseFormat === 'json') {
          expressResponse
            .status(200)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send({
              meta: authlessResponse.meta,
              page: authlessResponse.page,
              main: authlessResponse.main,
              xhrs: authlessResponse.xhrs,
            })
            .end()
        } else if (responseFormat === 'png') {
          expressResponse
            .status(200)
            .set('Content-Type', 'image/png')
            .end(await page.screenshot({fullPage: true}), 'binary')
        } else {
          expressResponse
            .status(501)
            .end('Can only handle responseFormat of type json or png')
        }
      } catch (err) {
        console.log(err.stack)
        const screenshotPath = `/tmp/${uuidv4() as string}.png`
        await page.screenshot({path: screenshotPath})
        console.log(`saved error screenshot to: ${screenshotPath}`)
        expressResponse.status(501).send('Server Error').end()
      } finally {
        await page.close()
        await browser.close()
      }
      try {
        await page.close()
        await browser.close()
      } catch (_) {}
    } catch (error) {
      console.log(`UNEXPECTED ERROR: ${error.stack as string}`)
      expressResponse.status(500).send(error.stack).end()
    }
  }

  public async run (): Promise<http.Server> {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded())
    const PORT = process.env.PORT ?? 3000

    app.get('/ping', Server.ping)
    app.get('/speedtest', Server.speedtest)
    app.get('/url', async (req, res) => await this.scrape(req, res))

    // start express
    return await new Promise((resolve, reject) => {
      try {
        const server = app.listen(PORT, () => {
          console.log(`Listening on port ${PORT}`)
          resolve(server)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
