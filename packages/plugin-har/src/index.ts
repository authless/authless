import { Har, HarConfig } from './har'

export default (config: HarConfig = {}): Har => {
  return new Har(config)
}
