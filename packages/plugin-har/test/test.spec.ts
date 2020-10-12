import PluginHar from '../src'
import { addExtra } from 'puppeteer-extra'
import originPuppeteer from 'puppeteer'

const puppeteer = addExtra(originPuppeteer)

describe('puppeteer-extra-plugin-har', () => {
  describe('single page', () => {
    test('it creates HAR file correctly [Page Closed]', async () => {
      /* eslint-disable-next-line no-empty-function */
      const callback = jest.fn(async () => {})
      puppeteer.use(PluginHar({ callback }))
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()
      await page.goto('http://example.com', { waitUntil: 'domcontentloaded' })
      await page.close()
      await browser.close()
      expect(callback.mock.calls.length).toBe(1)
    })

    test('it creates HAR file correctly [Browser Closed]', async () => {
      /* eslint-disable-next-line no-empty-function */
      const callback = jest.fn(async () => {})
      puppeteer.use(PluginHar({ callback }))
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()
      await page.goto('http://example.com', { waitUntil: 'domcontentloaded' })
      await browser.close()
      expect(callback.mock.calls.length).toBe(1)
    })
  })

  describe('multiple pages', () => {
    test('it creates HAR files with unique IDs', async () => {
      /* eslint-disable-next-line no-empty-function */
      const callback = jest.fn(async () => {})
      puppeteer.use(PluginHar({ callback }))
      const browser = await puppeteer.launch({ headless: true })
      const urls = [
        'https://example.com',
        'https://example.com',
        'https://en.wikipedia.org/wiki/URL'
      ]
      await Promise.all(urls.map(async url => {
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'domcontentloaded' })
        await page.close()
      }))
      await browser.close()
      const calls = callback.mock.calls
      expect(calls.length).toBe(3)
      const harIds = calls.map((call: any) => call[1].harId)
      expect((new Set(harIds)).size).toBe(3)
    })
  })

  describe('multiple browsers', () => {
    test('it creates HAR files with unique IDs', async () => {
      /* eslint-disable-next-line no-empty-function */
      const callback = jest.fn(async () => {})
      puppeteer.use(PluginHar({ callback }))
      const urls = [
        'https://example.com',
        'https://example.com',
      ]
      await Promise.all(urls.map(async url => {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'domcontentloaded' })
        await page.close()
        await browser.close()
      }))
      const calls = callback.mock.calls
      expect(calls.length).toBe(2)
      const harIds = calls.map((call: any) => call[1].harId)
      expect((new Set(harIds)).size).toBe(2)
    })
  })
})
