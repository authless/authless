## API Report File for "@authless/core"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Browser } from 'puppeteer';
import { Headers as Headers_2 } from 'puppeteer';
import { HttpMethod } from 'puppeteer';
import { LaunchOptions } from 'puppeteer';
import { Page } from 'puppeteer';
import { PuppeteerExtraPlugin } from 'puppeteer-extra';
import { Request as Request_2 } from 'puppeteer';
import { ResourceType } from 'puppeteer';
import { Response as Response_3 } from 'puppeteer';
import { Viewport } from 'puppeteer';

// @alpha
export class AnonBot extends Bot {
    constructor(config?: BotConfig);
    // (undocumented)
    type: string;
}

// @beta
export class AuthlessServer {
    // Warning: (ae-forgotten-export) The symbol "IServerConfig" needs to be exported by the entry point index.d.ts
    constructor(config: IServerConfig);
    // (undocumented)
    botRouter: BotRouter;
    // (undocumented)
    domainPathRouter: DomainPathRouter;
    // (undocumented)
    logger: any;
    // (undocumented)
    proxy?: ProxyConfig;
    // (undocumented)
    puppeteerParams?: PuppeteerParams;
    // (undocumented)
    puppeteerPlugins?: PuppeteerExtraPlugin[];
    // (undocumented)
    responses: any[];
    // (undocumented)
    run(): void;
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
export interface BotConfig {
    browserConfig?: BrowserConfig;
    credentials?: {
        username: string;
        password: string;
    };
    rateLimit?: number;
    urls: string[];
}

// @beta
export class BotRouter {
    constructor(bots: Bot[]);
    getBotByUsername(name: string): Bot;
    getBotForUrl(url: string): Bot;
}

// @beta
export interface BrowserConfig {
    adBlockerConfig?: {
        blockTrackers: boolean;
    };
    proxy?: ProxyConfig;
    puppeteerParams?: PuppeteerParams;
    puppeteerPlugins?: PuppeteerExtraPlugin[];
    urlParams?: URLParams;
    useAdBlockerPlugin?: boolean;
    useStealthPlugin?: boolean;
}

// @beta
export class DomainPath {
    constructor(domain: string);
    domain: string;
    pageHandler(page: Page, selectedBot?: Bot, config?: any): Promise<Response_2>;
    responses: Xhr[];
    setupPage(page: Page, puppeteerParams: PuppeteerParams): Promise<void>;
}

// @beta
export class DomainPathRouter {
    constructor(domainMap: {
        [url: string]: DomainPath;
    });
    addDomainPathRouter(router: DomainPathRouter): void;
    getDomainPath(url: string): DomainPath | undefined;
}

// @alpha (undocumented)
export type FetchParams = URLParams & {
    serverUrl: string;
};

// @beta (undocumented)
export interface IResource {
    sha1(): string;
}

// @beta
export interface IResourceCollection<T extends IResource> {
    toArray(): T[];
}

// @beta
export interface IResponse {
    // @deprecated
    content?: string;
    main: IResponseResponse;
    // Warning: (ae-forgotten-export) The symbol "IResponseMeta" needs to be exported by the entry point index.d.ts
    meta: IResponseMeta;
    page: IResponsePage;
    toResources(): IResourceCollection<IResource>;
    xhrs: IResponseResponse[];
}

// @beta
export interface IResponsePage {
    // (undocumented)
    content: string;
    // Warning: (ae-forgotten-export) The symbol "ICookie" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    cookies: ICookie[];
    // (undocumented)
    title: string;
    // (undocumented)
    url: string;
    // Warning: (ae-forgotten-export) The symbol "IViewport" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    viewport?: IViewport;
}

// @beta
export interface IResponseRequest {
    // Warning: (ae-forgotten-export) The symbol "IHeaders" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    headers: IHeaders;
    // (undocumented)
    isNavigationRequest: boolean;
    // Warning: (ae-forgotten-export) The symbol "IHttpMethod" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    method: IHttpMethod;
    // (undocumented)
    postData: any;
    // (undocumented)
    redirectChain: IResponseRequest[];
    // Warning: (ae-forgotten-export) The symbol "IResourceType" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    resourceType: IResourceType;
    // (undocumented)
    url: string;
}

// @beta
export interface IResponseResponse {
    // (undocumented)
    fromCache: boolean;
    // (undocumented)
    fromServiceWorker: boolean;
    // (undocumented)
    headers: IHeaders;
    // (undocumented)
    request: IResponseRequest;
    // Warning: (ae-forgotten-export) The symbol "ISecurityDetails" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    securityDetails: ISecurityDetails;
    // (undocumented)
    status: number;
    // (undocumented)
    statusText: string;
    // (undocumented)
    text: string;
    // (undocumented)
    url: string;
}

// @beta
export interface ProxyConfig {
    address: string;
    credentials: {
        username: string;
        password: string;
    };
    port: number;
}

// Warning: (ae-forgotten-export) The symbol "InterceptOptions" needs to be exported by the entry point index.d.ts
//
// @beta
export type PuppeteerParams = LaunchOptions & InterceptOptions & {
    viewPort?: Viewport;
};

// @alpha
export interface RequestContainer {
    headers: Headers_2;
    isNavigationRequest: boolean;
    method: HttpMethod;
    resourceType: ResourceType;
    url: string;
}

// @beta (undocumented)
export abstract class Resource implements IResource {
    sha1(input?: this): string;
}

// @beta
export abstract class ResourceCollection<T extends IResource> extends Map<string, T> {
    toArray(): T[];
}

// @beta (undocumented)
export const ResourceConstructor: {
    toHashResourcePair<T extends IResource>(resources: T[]): [string, T][];
};

// @beta
class Response_2 implements IResponse {
    constructor(serializedResponse: any);
    // Warning: (ae-incompatible-release-tags) The symbol "convertRequestToJson" is marked as @beta, but its signature references "RequestContainer" which is marked as @alpha
    static convertRequestToJson(request: Request_2): Promise<RequestContainer>;
    static convertResponseToJson(response: Response_3): Promise<Xhr>;
    static fromPage(page: Page, data: {
        mainResponse: Response_3;
        bot: Bot;
        responses: Xhr[];
    }): Promise<Response_2>;
    // (undocumented)
    main: IResponseResponse;
    // (undocumented)
    meta: IResponseMeta;
    // (undocumented)
    page: IResponsePage;
    toResources(): IResourceCollection<IResource>;
    // (undocumented)
    xhrs: IResponseResponse[];
}

export { Response_2 as Response }

// @beta
export interface URLParams {
    // @alpha
    alphabetSelector?: string;
    // @alpha
    inputs?: string;
    referer?: string;
    responseFormat: 'json' | 'png';
    url: string;
    username?: string;
}

// @beta
export interface Xhr {
    fromCache: boolean;
    fromServiceWorker: boolean;
    headers: Headers_2;
    // Warning: (ae-incompatible-release-tags) The symbol "request" is marked as @beta, but its signature references "RequestContainer" which is marked as @alpha
    request: RequestContainer | undefined;
    // Warning: (ae-forgotten-export) The symbol "SecurityDetails" needs to be exported by the entry point index.d.ts
    securityDetails: SecurityDetails | null;
    status: number;
    statusText: string;
    text: string | undefined;
    url: string;
}


```