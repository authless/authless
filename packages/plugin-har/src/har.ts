import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin'
import PuppeteerHar from '@authless/puppeteer-har'

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface HarConfig {
  callback?: HarCallback
}

type TargetId = string
type BrowserProcessId = string
type HarId = string
type HarObject = any
type HarCallback = (error: Error | null, data: { har: HarObject, harId: HarId } | null) => Promise<void>

export class Har extends PuppeteerExtraPlugin {

  /**
   * manages {@link PuppeteerHar} instances by assigning them to their {@link TargetId}
   */
  protected targetMap: Map<HarId, PuppeteerHar>
  /* eslint-disable-next-line no-empty-function */
  protected readonly harCallback: HarCallback = async () => {}

  constructor (config: HarConfig = {}) {
    super(config)
    this.targetMap = new Map<HarId, PuppeteerHar>()
    if (typeof config.callback !== 'undefined') {
      this.harCallback = config.callback
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  get name (): string {
    return 'har'
  }

  private static getTargetId (target: any): TargetId {
    const targetUrl: string = target.url()
    const targetId = target._targetInfo?.targetId
    if (typeof targetId !== 'string') {
      throw new Error(`failed to get target id for target: ${targetUrl} (type: ${target.type() as string})`)
    }
    return targetId
  }

  private static getBrowserProcessId (target: any): BrowserProcessId {
    const targetUrl: string = target.url()
    const browser = target.browser()
    const processId = `${browser._process?.pid as string}`
    if (typeof processId !== 'string') {
      throw new Error(`failed to get browser process id for target: ${targetUrl} (type: ${target.type() as string})`)
    }
    return processId
  }

  private static getHarId (target: any): HarId {
    return `${this.getBrowserProcessId(target)}-${this.getTargetId(target)}`
  }

  protected async startRecording (target): Promise<void> {
    const harId = Har.getHarId(target)
    const page = await target.page()
    const har = new PuppeteerHar(page)
    await har.start()
    this.debug(`recording HAR [ID: ${harId}]`)
    this.targetMap.set(harId, har)
  }

  protected async finishRecording (harId: HarId): Promise<void> {
    const harInstance = this.targetMap.get(harId)
    if (!(harInstance instanceof PuppeteerHar)) {
      throw new Error(`Expected to find HAR instance for har id: ${harId}`)
    }
    this.targetMap.delete(harId)
    try {
      let start = Date.now()
      const harObject = await harInstance.stop()
      this.debug(`recorded HAR [ID: ${harId}]. (serialized in ${Date.now() - start}ms)`)
      await this.harCallback(null, { har: harObject, harId })
    } catch (error) {
      await this.harCallback(error, null)
    }
  }

  async onTargetCreated (target): Promise<void> {
    if (target.type() === 'page') {
      await this.startRecording(target)
    }
  }

  async onTargetDestroyed (target): Promise<void> {
    if (target.type() === 'page') {
      const harId = Har.getHarId(target)
      await this.finishRecording(harId)
    }
  }

  async onDisconnected (): Promise<void> {
    if (this.targetMap.size > 0) {
      this.debug.extend('disconnect')(`open recordings discovered: ${this.targetMap.size}`)
      const openHarIds = Array.from(this.targetMap.keys())
      await Promise.all(openHarIds.map(async harId => {
        /* eslint-disable-next-line no-return-await */
        return await this.finishRecording(harId)
      }))
    }
  }

}
