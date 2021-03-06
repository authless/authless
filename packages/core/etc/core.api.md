## API Report File for "@authless/core"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { BotConfig } from '@authless/common';
import { Browser } from 'puppeteer';
import { BrowserConfig } from '@authless/common';
import { Page } from 'puppeteer';
import { PuppeteerParams } from '@authless/common';
import { Response as Response_2 } from 'puppeteer';
import { Response as Response_3 } from '@authless/common';

// @alpha
export class AnonBot extends Bot {
    constructor(config?: BotConfig);
    // (undocumented)
    type: string;
}

// @beta
export class Bot {
    constructor(botConfig: BotConfig);
    browserConfig?: BrowserConfig;
    foundCaptcha(found: Boolean): void;
    foundLogin(found: Boolean): void;
    getCaptchaHitCount(): number;
    getLoginHitCount(): number;
    getUsage(): number;
    isBelowRateLimit(): Boolean;
    // (undocumented)
    launchBrowser(defaultBrowserConfig?: BrowserConfig): Promise<Browser>;
    password?: string;
    urls: string[];
    username?: string;
    wasUsed(): void;
}

// @beta
export class BotRouter {
    constructor(bots: Bot[]);
    getBotByUsername(name: string): Bot;
    getBotForUrl(url: string): Bot;
}

// @beta
export class DomainPath {
    constructor(domain: string);
    domain: string;
    pageHandler(page: Page, selectedBot?: Bot, config?: any): Promise<Response_3>;
    setupPage(page: Page, puppeteerParams: PuppeteerParams): Promise<void>;
    xhrResponses: Response_2[];
}

// @beta
export class DomainPathRouter {
    constructor(domainMap: {
        [url: string]: DomainPath;
    });
    addDomainPathRouter(router: DomainPathRouter): void;
    getDomainPath(url: string): DomainPath | undefined;
}


```
