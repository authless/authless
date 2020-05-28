import { Service } from '../service'

/**
 * @alpha
 */
export class ServiceDefault extends Service {
  constructor () {
    super()
    this.name = 'default:default'
  }

  /* eslint-disable-next-line class-methods-use-this */
  getMatchingUrls (): string[] {
    return ['/*']
  }
}
