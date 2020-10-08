import { BotConfig, BrowserConfig } from '@authless/common';
import { Browser } from 'puppeteer';
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
//# sourceMappingURL=bot.d.ts.map