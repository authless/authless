# @authless/puppeteer-extra-plugin-har

> This is a plugin for [puppeteer-extra](https://github.com/berstend/puppeteer-extra) that allows you to create a HAR file from your page.

### Install

```bash
yarn add @authless/puppeteer-extra-plugin-har
```

### Usage

```typescript
import { PluginHar } from '@authless/puppeteer-extra-plugin-har'
import puppeteer from 'puppeteer-extra'

const main = async () => {
  puppeteer.use(PluginHar({
    callback: (error: Error | null, result: { har: any, targetId: string } | null) => {
      if (result instanceof Object) {
        // inspect HAR object or store it somewhere ...
      }
    }
  }))
}
```
