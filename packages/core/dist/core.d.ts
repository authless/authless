/**
 * A HTTP data harvesting framework for jobs that require authentication
 *
 * @remarks
 *
 * Provides the core abstractions and functionality.
 *
 * @packageDocumentation
 */

import { BotConfig } from '@authless/common';
import { Browser } from 'puppeteer';
import { BrowserConfig } from '@authless/common';
import { Page } from 'puppeteer';
import { PuppeteerParams } from '@authless/common';
import { Response as Response_2 } from 'puppeteer';
import { Response as Response_3 } from '@authless/common';

/**
 * The "Anonymous Bot", i.e. a bot that has no credentials.
 *
 * @alpha
 */
export declare class AnonBot extends Bot {
    type: string;
    constructor(config?: BotConfig);
}

/**
 * Represents a user account used in authless.
 *
 * @remarks
 *
 * Extend this class to create custom Bots
 * Is usually managed with a {@link BotRouter}
 * and contains meta information about the
 * credentials, usage-data and health-status of an account
 *
 * @beta
 */
export declare class Bot {
    /**
     * The username or key of the account. May be undefined for anonymous bots
     */
    username?: string;
    /**
     * The password or secret of the account. May be undefined for anonymous bots
     */
    password?: string;
    /**
     * The URLs to be handled by this bot
     */
    urls: string[];
    /**
     * The puppeteer/page options for the bot {@link BrowserConfig}
     */
    browserConfig?: BrowserConfig;
    /**
     * The number of times bot has been used
     */
    private hitCount;
    /**
     * The number of times bot has run into login page
     */
    private loginCount;
    /**
     * The number of times bot has run into captcha
     */
    private captchaCount;
    /**
     * The upper limit for the number of times this bot can be used
     * rateLimit of 0 means no rate limiting
     */
    private readonly rateLimit;
    /**
     * The array containing the timestamps that this bot was used at in the last one hour.
     * Allows us to check if the rate-limit has been exceeded.
     */
    private usageTimeStamps;
    /**
     * Create a Bot instance.
     *
     * @param config - Of type {@link BotConfig}. browserConfig takes type {@link BrowserConfig}
     * @returns An instance of the Bot class
     *
     * @example
     * ```ts
     * const bot = new Bot({
     *  credentials: { // optional
     *    username: 'username',
     *    password: 'password'
     *  },
     *  urls: ['www.example.com'],
     *  rateLimit: 100, // optional, per hour
     *  browserConfig: {
     *    executablePath: '/path/to/your/Chromium',
     *    headless: false,
     *    useStealthPlugin: true,
     *    useAdblockerPlugin: true,
     *    blockDomains: [
     *      'some-tracker.io',
     *      'image-host.net',
     *    ],
     *    blockResourceTypes: ['image', 'media', 'stylesheet', 'font'],
     *    proxy: {
     *      address: '99.99.99.99',
     *      port: 9999,
     *      credentials: {
     *        username: 'proxyuser1',
     *        password: 'proxypass1',
     *      },
     *    }
     *  }
     * })
     * ```
     *
     * @beta
     */
    constructor(botConfig: BotConfig);
    launchBrowser(defaultBrowserConfig?: BrowserConfig): Promise<Browser>;
    /**
     * Tells the bot that it was used for authentication. Updates {@link Bot.usageTimeStamps}
     *
     * @remarks
     * The bot can use this information to calculate its usage-rate w.r.t its rate-limit.
     *
     * @beta
     */
    wasUsed(): void;
    /**
     * Tells the bot that the login page was found
     *
     * @remarks
     * The bot can use this information to calculate logout rates
     * High logout rates could mean user information is not saved
     * between page hits or the website is logging us out
     *
     * @param found - if the page hit was a login page or not
     * @returns nothing
     *
     * @beta
     */
    foundLogin(found: Boolean): void;
    /**
     * Tells the bot we ran into a captcha
     *
     * @remarks
     * The bot can use this information to calculate detection rates
     * High detection rates could mean the account is in danger of getting
     * blacklisted or we have interactions or extensions which are triggering
     * bot-detection
     *
     * @param found - if the page hit was a captcha page or not
     * @returns nothing
     *
     * @beta
     */
    foundCaptcha(found: Boolean): void;
    /**
     * Returns the number of times this was used in the last hour
     *
     * @returns The number of times this bot was used in the last hour
     */
    getUsage(): number;
    /**
     * To check if bot usage-rate is below the allowed limit
     *
     * @remarks
     * If the usage-rate is above the rate-limit
     * we have to add more time between page-fetching or add more accounts
     * else the account may be blacklisted
     *
     * @returns true if current bot is under the usage rate-limit, false otherwise
     *
     * @beta
     */
    isBelowRateLimit(): Boolean;
    /**
     * Get the login hit-rate percentage of the bot
     *
     * @returns number of times the login hit-rate percentage of the bot
     *
     * @beta
     */
    getLoginHitCount(): number;
    /**
     * Get the captcha hit-rate percentage of the bot
     *
     * @returns number of times the captcha hit-rate percentage of the bot
     *
     * @beta
     */
    getCaptchaHitCount(): number;
}

/**
 * Manages a pool(zero or more) Bots {@link Bot}
 * Is responsible for rotating the bots used in a round-robin fashion.
 *
 * @beta
 */
export declare class BotRouter {
    /**
     * A map of urls to Bot instances
     *
     * @remarks
     * Each url is mapped to the bots which can handle it
     * and the index of the current bot to be returned
     */
    private readonly botMap;
    /**
     * Create a BotRouter instance.
     *
     * @param botMap - The map of url to Bot instance
     * @returns An instance of the BotRouter class
     *
     * @example
     * ```ts
     * const botRouter = new BotRouter({
     *   'www.example.com/basic-access/': new Bot('basic-username', 'basic-password'),
     *   'www.example.com/pro-access/': new Bot('pro-username', 'pro-password'),
     * })
     * ```
     *
     * Internally, we store it as a map of \{url: Bot-Data\}
     * by converting a structure of form
     * ```ts
     * [
     *   Bot1{urls: ['url1', 'url2', 'url3'..]},
     *   Bot2{urls: ['url4', 'url5', 'url6'..]},
     *   Bot3{urls: ['url1', 'url4'..]}
     * ]
     * ```
     * to
     * ```ts
     * {
     *   'url1': { index: 0, bots: [Bot1, Bot3] },
     *   'url2': { index: 0, bots: [Bot1] },
     *   'url3': { index: 0, bots: [Bot1] },
     *   'url4': { index: 0, bots: [Bot1, Bot3] },
     *   'url5': { index: 0, bots: [Bot1] },
     *   'url6': { index: 0, bots: [Bot1] },
     * }
     * ```
     * as it makes it easier to fetch by url and cycle though Bots
     *
     * @beta
     */
    constructor(bots: Bot[]);
    /**
     * Provides a bot which can handle a particular url
     *
     * @remarks
     * Picks a bot from the pool of {@link Bot} to return one
     * that can handle the url provided and is below the bots' allowed rate-limit.
     * Also calls wasUsed() of the returned Bot so that its usage is updated.
     *
     * @returns a valid bot if found, else returns undefined
     *
     */
    getBotForUrl(url: string): Bot;
    /**
     * Provides a bot with a particular username
     *
     * @remarks
     * Picks a bot from the pool of {@link Bot} which has the username provided
     * that can handle the url provided.
     * This is useful when we want to check if a bot is healthy
     * in term of its usageRate, loginHitCount, captchaHitCount etc
     *
     * @param username - the username string of the bot to get
     * @returns a valid bot if found, else returns undefined
     *
     */
    getBotByUsername(name: string): Bot;
}

/**
 * The interface that controls the behaviour and page-handling for a particular domain/subdomain/url
 *
 * @remarks
 *
 * This is responsible for handling the page that is fetched.
 * If different behaviours are required for different URLs
 * (say some pages have pagination, while others require you to expand links)
 * then, you should have multiple DomainPaths and attach them to the requried URL
 * via a DomainPathHandler {@link DomainPathRouter}
 * Extend this class to create custom DomainPath behaviours
 * You can add custom behaviour in the getJsonResponse(), setupPage() and pageHandler() functions
 *
 * @example
 *
 * ```ts
 * // create 2 DomainPaths
 * class PaginationDomainPath extends DomainPath {
 *   pageHandler(page...) {
 *     // handle pagination and other page specific actions here
 *   }
 * }
 * class ExpandableDomainPath extends DomainPath {
 *   pageHandler(page...) {
 *     // handle expanding links or page specific inputs here
 *   }
 * }
 *
 * const domainPathRouter = new DomainPathRouter({
 *   'www.example.com/pagination/': new PaginationDomainPath('pagination'),
 *   'www.example.com/links/': new ExpandableDomainPath('expanding-links')
 * })
 *
 * Now, get the right domainPath by url and use it. Refer to docs
 * ```
 *
 * @beta
 *
 *
 * @beta
 */
export declare class DomainPath {
    /**
     * Name of the domain. Useful for differentiating DomainPaths while logging
     */
    domain: string;
    /**
     * Save the array of xhr responses as needed.
     * Certain resourceTypes can be blocked
     * by passing blockResourceTypes in {@link PuppeteerParams}
     */
    xhrResponses: Response_2[];
    /**
     * Create a DomainPath instance.
     *
     * @param domain - The name of the domain, useful for logging
     * @returns An instance of the DomainPath class
     *
     * @example
     * ```ts
     * const dpath = new DomainPath('my-domain')
     * ```
     *
     * @beta
     */
    constructor(domain: string);
    private addResponseHook;
    private addRequestBlockers;
    /**
     * Over-ride default page setup
     *
     * @remarks
     * Override this to add custom page listeners on response etc.
     * This happens before we navigate to the target URL.
     * Call super.setupPage if you would like to use default response/resourceType blocking
     *
     * @param page - The puppeteer page to which we can attach listeners or change behaviour of
     * @param puppeteerParams - The {@link PuppeteerParams} object passed by the user
     */
    setupPage(page: Page, puppeteerParams: PuppeteerParams): Promise<void>;
    /**
     * Code to handle page interactions
     *
     * @remarks
     * This is responsible for checking/doing authentication
     * and interacting with the page.
     * You can have different DomainPaths with different behaviour
     * and call the appropriate one based on the URL you wish to fetch
     * The puppeteer instance will be reused and only new pages are instantiated here
     *
     *
     * @param page - The puppeteer page to which we can attach listeners or change behaviour of
     * @param selectedBot - Optional. The {@link Bot} to use for authentication.
     * @param config - Optional. The {@link BrowserConfig} passed by the user
     */
    pageHandler(page: Page, selectedBot?: Bot, config?: any): Promise<Response_3>;
}

/**
 * Manages a pool of {@link DomainPath} mapped to an url each
 *
 * @beta
 */
export declare class DomainPathRouter {
    /**
     * The map of urls to DomainPath instances.
     */
    private domainMap;
    /**
     * Create a DomainPathRouter instance.
     *
     * @param domainMap - The map of url to DomainPath instance
     * @returns An instance of the DomainPathRouter class
     *
     * @example
     * ```ts
     * const dpRouter = new DomainPathRouter({
     *   'www.example.com/dogs/': new DogDomainPath('dog-handler'),
     *   'www.example.com/horses/': new HorseDomainPath('horse-handler'),
     * })
     *
     * const dp = dpRouter.getDomainPath(someUrl)
     * const response = dp.pageHandler(page, ...)
     * ```
     *
     * @beta
     */
    constructor(domainMap: {
        [url: string]: DomainPath;
    });
    /**
     * Add DomainPaths from another DomainPathRouter
     */
    addDomainPathRouter(router: DomainPathRouter): void;
    /**
     * returns a {@link DomainPath} that matches the url, else returns undefined
     *
     * @param url - the HTTP URL which is to be fetched
     * @returns a {@link DomainPath} if found, else returns undefined
     *
     */
    getDomainPath(url: string): DomainPath | undefined;
}

export { }
