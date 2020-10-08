import { LaunchOptions } from 'puppeteer';
import { Page } from 'puppeteer';
import { PuppeteerExtraPlugin } from 'puppeteer-extra';
import { Request as Request_2 } from 'puppeteer';
import { ResourceType } from 'puppeteer';
import { Response as Response_3 } from 'puppeteer';
import { SecurityDetails } from 'puppeteer';
import { Viewport } from 'puppeteer';

/**
 * The configuration to instantiate a Bot.
 * Is passed to a {@link Bot}
 *
 * @beta
 */
export declare interface BotConfig {
    /**
     * The credentials for a bot.
     * May be omitted for anonymous bots(no authentication needed)
     */
    credentials?: {
        username: string;
        password: string;
    };
    /**
     * The HTTP URLs the bot is to handle.
     * Must be a list of string
     */
    urls: string[];
    /**
     * The limit per hour under which a bot can be used.
     *
     * @remarks
     * If the usage is above the limit, the bot-router will not return this bots
     * till an appropriate amount of time has passed
     */
    rateLimit?: number;
    /**
     * The puppeteer specific configuration for the bot. {@link BrowserConfig}
     *
     * @remarks
     * This allows bots to have their own proxy/plugin configurations.
     */
    browserConfig?: BrowserConfig;
}

/**
 * Config to control puppeteer launch, default plugins, proxy and page handling config
 *
 * @beta
 */
export declare interface BrowserConfig {
    /**
     * Options to control puppeteer launch {@link PuppeteerParams}
     */
    puppeteerParams?: PuppeteerParams;
    /**
     * Use the puppeteer-extra-stealth-plugin
     *
     * @remarks
     * Uses a pre-setup puppeteer-extra-stealth-plugin that gets used with the launched puppeteer instance
     */
    useStealthPlugin?: boolean;
    /**
     * Use the puppeteer-extra-adblocker-plugin
     *
     * @remarks
     * Uses a pre-setup puppeteer-extra-adblocker-plugin with \{blockTrackers: all\} option by default
     */
    useAdBlockerPlugin?: boolean;
    /**
     * Options for the puppeteer-extra-adblocker-plugin
     *
     * @remarks
     * Uses a pre-setup puppeteer-extra-adblocker-plugin with \{blockTrackers: all\} option by default
     * If you would like to override it, you can do so here
     *
     * @beta
     */
    adBlockerConfig?: {
        blockTrackers: boolean;
    };
    /**
     * Additional plugins to puppeteer. Must be a valid initialized puppeteer plugin {@link PuppeteerParams}
     *
     * @example
     * puppeteerPlugins: [MyPuppeteerPlugin(), OtherPuppeteerPlugin()]
     */
    puppeteerPlugins?: PuppeteerExtraPlugin[];
    /**
     * Proxy configuration for puppeteer {@link puppeteer#ProxyConfig}
     *
     * @remarks
     * If not provided, the puppeteer will run without a proxy
     */
    proxy?: ProxyConfig;
    /**
     * The URL parameters to pass to the running Authless server {@link URLParams}
     *
     * @example
     * ```ts
     * { url: 'http://url.com/to/fetch', 'responseFormat': 'json' }
     * ```
     */
    urlParams?: URLParams;
}

/**
 * @alpha
 */
export declare type FetchParams = URLParams & {
    serverUrl: string;
};

/**
 * Options to block requests or resourceTypes
 *
 * @remarks
 * Options to block requests from certain websites/IP-addresses
 * as well as avoid saving some resourceTypes to {@link IResponse}.{@link Xhr}
 * Blocking domains may help load times of pages
 * and blocking requests may reduce the size of the Authless response {@link IResponse}
 *
 * @beta
 */
declare interface InterceptOptions {
    /**
     * Domains/IP-addresses to block from loading
     *
     * @example
     * ```ts
     * blockDomains: ['social-media-buttons.com', 'large-image-host.com']
     * ```
     */
    blockDomains?: string[];
    /**
     * resourceTypes {@link ResourceType} to not save to Authless response {@link IResponse}
     *
     * @example
     * ```ts
     * blockResourceTypes: ['image', 'media', 'font']
     * ```
     */
    blockResourceTypes?: ResourceType[];
}

/**
 * @beta
 */
export declare interface IResource {
    /**
     * Creates the sha1 hash of the resource.
     *
     * @remarks
     * If the resource has noisy attributes such as trackingIDs or debugging info that is not
     * relevant to the resource as such, the implementation may decide to omit such attributes
     * to produce the same sha1 hash for resources that would e.g. otherwise have different trackingID values.
     *
     * @example
     *
     * ```ts
     * // example implementation of the sha1 function which omits the `trackingNumber` property
     * function sha1 (object): string {
     *   const clone = { ...object }
     *   Reflect.deleteProperty(clone, 'trackingNumber')
     *   return super.sha1(clone, { algorithm: 'sha1' })
     * }
     *
     * // Returns true
     * sha1({value: 1, trackingNumber: '123'}) === sha1({value: 1, trackingNumber: '456'})
     * ```
     */
    sha1(): string;
}

/**
 * Holds none, one, or many {@link IResource | Resources} and is usually created
 * via {@link IResponse.toResources}.
 *
 * @beta
 */
export declare interface IResourceCollection<T extends IResource> {
    /**
     * Create an Array of {@link IResource | Resources}. Omits keys.
     */
    toArray(): T[];
}

/**
 * The raw response from a service including any (xhrs) requests and responses and meta information.
 *
 * @remarks
 *
 * A {@link IResponse} can be transformed into a {@link IResourceCollection}
 * which extracts the most relevant data from an {@link IResponse}.
 *
 * Service repositories should create their own response class implementing {@link IResponse}.
 *
 * @privateRemarks
 *
 * - Serializable: TRUE
 * - Serialization Format: Avro
 *
 * @beta
 */
export declare interface IResponse {
    /**
     * Meta data about response. See {@link IResponse.meta}.
     */
    meta: IResponseMeta;
    /**
     * The main page response. See {@link IResponsePage}.
     */
    page: ISerializedPage;
    /**
     * The main request & response chain. See {@link IResponseResponse}.
     */
    main: ISerializedResponse;
    /**
     * Any XHR request & responses. See {@link IResponseResponse}.
     */
    xhrs: ISerializedResponse[];
    /**
     * Creates a {@link IResponseResponse} from an {@link IResponse} instance.
     */
    toResources(): IResourceCollection<IResource>;
}

/**
 * Authless meta information about the response of a page {@link IResponse}
 * Can include the timestamp when the page was fetched
 *
 * @beta
 */
declare interface IResponseMeta {
    timestamp: number;
    username: string;
}

/**
 * @beta
 */
declare interface ISerializedPage {
    url: ReturnType<Page['url']>;
    viewport: ReturnType<Page['viewport']>;
    content: PromiseValue<ReturnType<Page['content']>>;
    cookies: PromiseValue<ReturnType<Page['cookies']>>;
    title: PromiseValue<ReturnType<Page['title']>>;
}

/**
 * @beta
 */
declare interface ISerializedRequest {
    headers: ReturnType<Request_2['headers']>;
    isNavigationRequest: ReturnType<Request_2['isNavigationRequest']>;
    method: ReturnType<Request_2['method']>;
    postData: ReturnType<Request_2['postData']>;
    resourceType: ReturnType<Request_2['resourceType']>;
    url: ReturnType<Request_2['url']>;
    redirectChain: ISerializedRequest[];
}

/**
 * @beta
 */
declare interface ISerializedResponse {
    request: ISerializedRequest;
    url: ReturnType<Response_3['url']>;
    status: ReturnType<Response_3['status']>;
    statusText: ReturnType<Response_3['statusText']>;
    headers: ReturnType<Response_3['headers']>;
    securityDetails: ISerializedSecurityDetails | null;
    fromCache: ReturnType<Response_3['fromCache']>;
    fromServiceWorker: ReturnType<Response_3['fromServiceWorker']>;
    /**
     * The response body as a string or `null` if not availble, e.g.
     * when response is a redirect response
     */
    text: PromiseValue<ReturnType<Response_3['text']>> | null;
}

/**
 * @public
 */
declare interface ISerializedSecurityDetails {
    issuer: ReturnType<SecurityDetails['issuer']>;
    protocol: ReturnType<SecurityDetails['protocol']>;
    subjectName: ReturnType<SecurityDetails['subjectName']>;
    validFrom: ReturnType<SecurityDetails['validFrom']>;
    validTo: ReturnType<SecurityDetails['validTo']>;
}

export declare const Mapper: {
    page: {
        toObject: (page: Page) => Promise<ISerializedPage>;
    };
    request: {
        toObject: (request: Request_2) => Promise<ISerializedRequest>;
    };
    response: {
        toObject: (response: Response_3) => Promise<ISerializedResponse>;
    };
    securityDetails: {
        toObject: (securityDetails: SecurityDetails) => Promise<ISerializedSecurityDetails>;
    };
};

declare type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value> ? {
    0: PromiseValue<Value>;
    1: Value;
}[PromiseType extends Promise<unknown> ? 0 : 1] : Otherwise;

/**
 * Options to add a proxy to Puppeteer connections
 *
 * @beta
 */
export declare interface ProxyConfig {
    /**
     * The IP address of the proxy
     */
    address: string;
    /**
     * The port number of the proxy
     */
    port: number;
    /**
     * The user credentials to connect to the proxy
     */
    credentials: {
        /**
         * The username for the proxy
         */
        username: string;
        /**
         * The password for the proxy
         */
        password: string;
    };
}

/**
 * Config options control puppeteer launch/request-handling options
 *
 * @remarks
 *
 * Puppeteer launch options includes all options that of type {@link puppeteer#LaunchOptions}
 * Options to block domains/resourceTypes from loading {@link puppeteer#InterceptOptions}
 * Options to control theh viewport {@link puppeteer#Viewport}
 *
 * @example
 * ```ts
 * {
 *    executablePath: '/Path/To/Your/Chromium', // optional
 *    headless: false, // default true,
 *    // other options that can be passed to puppeteer(options)
 *
 *    blockDomains: ['social-media-buttons.com', 'large-image-host.com'],
 *    blockResourceTypes: ['image', 'media', 'font'],
 *    viewPort: { width: 1020, height: 800 }
 * }
 * ```
 *
 * @beta
 */
export declare type PuppeteerParams = LaunchOptions & InterceptOptions & {
    /**
     * Optional. Control puppeteer viewport window size
     *
     * @example
     * ```ts
     * { width: 1020, height: 800 }
     * ```
     */
    viewPort?: Viewport;
};

/**
 * @beta
 */
export declare abstract class Resource implements IResource {
    /**
     * See {@link IResource.sha1}.
     *
     * @remarks
     * Does not omit any properties of the resource
     */
    sha1(input?: this): string;
}

/**
 * Abstract implementation of {@link IResourceCollection}. Extends {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}.
 *
 * @beta
 */
export declare abstract class ResourceCollection<T extends IResource> extends Map<string, T> {
    /**
     * see {@link IResourceCollection}
     */
    toArray(): T[];
}

/**
 * @beta
 */
export declare const ResourceConstructor: {
    /**
     * Generates the `sha1` hash of any resource object and returns the sha1-resource pair.
     *
     * @remarks
     * This allows downstream tasks to easily compute a list that only contains unique
     * values by filtering out duplicate sha1 keys. See the example for usage.
     *
     * @example
     *
     * ```ts
     * // to create a ResourceCollection that has only unique and no duplicate resources
     * const resources: IResource[] = [{}, {}, ...]
     * const uniqueResourceCollection = new ResourceCollection(
     *   ResourceConstructor.toHashResourcePair(resources)
     * )
     * ```
     *
     * @returns An array for sha1-resource pairs. For example:
     *          [
     *            [ 'SHA1-1234', {@link IResource} ],
     *            [ 'SHA1-5678', {@link IResource} ],
     *          ]
     */
    toHashResourcePair<T extends IResource>(resources: T[]): [string, T][];
};

/**
 * see {@link IResponse}
 *
 * @beta
 */
declare class Response_2 implements IResponse {
    meta: IResponseMeta;
    page: ISerializedPage;
    main: ISerializedResponse;
    xhrs: ISerializedResponse[];
    constructor(serializedResponse: any);
    /**
     * see {@link IResponse.toResources}. Needs to be implemented by services.
     */
    toResources(): IResourceCollection<IResource>;
    /**
     * Construct a {@link Response} instance from the puppeteer page
     *
     * @remarks
     *
     * Override this to add custom data/metadata to your Authless response {@link IResponse}.
     *
     * @param   page - the puppeteer page from which to extract the response object
     * @param   mainResponse - the main puppeteer response from which to extract the Xhr object {@link Xhr}
     *
     * @returns the generated {@link Response}
     */
    static fromPage(bot: any, page: Page, mainResponse: Response_3, xhrResponses: Response_3[]): Promise<Response_2>;
}
export { Response_2 as Response }

/**
 * URL parameters accepted by Authless server
 *
 * @remarks
 * URL parameters allow you to run an Authless server and send HTTP requests
 * to it with the url you want it to fetch.
 * Authless server will return an Authless response {@link IResponse} of your choice
 *
 * @example
 * ```ts
 * {
 *    url: 'www.example.net/url/to/fetch',
 *    responseFormat: 'json', // will return an object in JSON format
 * }
 * ```
 *
 * @beta
 */
export declare interface URLParams {
    /**
     * The HTTP url to fetch
     *
     * @example
     * ```ts
     * 'www.example.net/url/to/fetch'
     * ```
     */
    url: string;
    /**
     * An array values for HTML input elements.
     *
     * @remarks
     * Each input-html-selector:value-to-enter are separated by a colon(:)
     * Multiple inputs are separated by a semi-colon(;)
     *
     * @example
     * ```ts
     * // To enter 'my value1' into HTML element with selector '#input1'
     * // and '9999' into HTML element with selector '#input2'
     * // use
     * { inputs: '#input1:my value1;#input2:9999' }
     * ```
     *
     * @alpha
     */
    inputs?: string;
    /**
     * The HTML input selector to which puppeteer should enter alphabets from your {@link DomainPath}.pageHandler function.
     *
     * @remarks
     *
     * Since input selectors may change with each load(randomization of HTML selector string),
     * the selector may be passed here as strings and page handler can be customized to
     * enter values if it receives any selector via the alphabetSelector option
     *
     * @example
     *
     * ```ts
     * { alphabetSelector: '.my-input-selector' }
     * ```
     *
     * @alpha
     */
    alphabetSelector?: string;
    /**
     * The required response format of Authless response
     *
     * @remarks
     * Currently, only 'json' is supported
     *
     * @beta
     */
    responseFormat: 'json' | 'png';
    /**
     * The referer URL that will be added to the puppeteer request
     *
     * @remarks
     * Adding a proper referer makes your request much less likely to get flagged
     * as a bot. Try to add a reasonable referer URL
     *
     * @beta
     */
    referer?: string;
    /**
     * The username whose credentials will be used for the fetch
     */
    username?: string;
}

export { }
