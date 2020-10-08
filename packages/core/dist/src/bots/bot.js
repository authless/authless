"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const path = __importStar(require("path"));
const puppeteer_extra_1 = require("puppeteer-extra");
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_extra_plugin_proxy_1 = __importDefault(require("puppeteer-extra-plugin-proxy"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const uuid_1 = require("uuid");
// 1 minute = 60_000 milliseconds
// 1 hour = 60 * 60_000 milliseconds = 3_600_000
const ONE_HOUR = 3600000;
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
class Bot {
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
    constructor(botConfig) {
        var _a, _b, _c;
        /**
         * The number of times bot has been used
         */
        this.hitCount = 0;
        /**
         * The number of times bot has run into login page
         */
        this.loginCount = 0;
        /**
         * The number of times bot has run into captcha
         */
        this.captchaCount = 0;
        /**
         * The upper limit for the number of times this bot can be used
         * rateLimit of 0 means no rate limiting
         */
        this.rateLimit = 0;
        if (typeof botConfig.credentials !== 'undefined' && botConfig.urls.length === 0) {
            throw new Error('Bots with credentials must have atleast one URL, as the Bot will never be selected otherwise');
        }
        this.username = (_a = botConfig.credentials) === null || _a === void 0 ? void 0 : _a.username;
        this.password = (_b = botConfig.credentials) === null || _b === void 0 ? void 0 : _b.password;
        this.urls = botConfig.urls;
        if (typeof botConfig.rateLimit === 'number') {
            this.rateLimit = (_c = botConfig.rateLimit) !== null && _c !== void 0 ? _c : 0;
        }
        this.browserConfig = botConfig.browserConfig;
        this.usageTimeStamps = [];
    }
    launchBrowser(defaultBrowserConfig = {}) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const browserConfig = Object.assign(Object.assign({}, defaultBrowserConfig), this.browserConfig);
            // INIT BROWSER PLUGINS
            let defaultPlugins = [];
            if (browserConfig.useStealthPlugin === true) {
                defaultPlugins.push(puppeteer_extra_plugin_stealth_1.default());
            }
            // -- Has conflicts with stealth-plugin, re-enable when fixed
            // -- refer: https://github.com/berstend/puppeteer-extra/issues/90
            // if(browserConfig.useAdBlockerPlugin === true) {
            //   defaultPlugins.push(AdblockerPlugin(config?.adBlockerConfig ?? {}))
            // }
            if (browserConfig.proxy instanceof Object) {
                defaultPlugins.push(puppeteer_extra_plugin_proxy_1.default(browserConfig.proxy));
            }
            const plugins = [...defaultPlugins, ...((_a = browserConfig.puppeteerPlugins) !== null && _a !== void 0 ? _a : [])];
            const customPuppeteer = puppeteer_extra_1.addExtra(puppeteer_1.default);
            plugins.forEach((plugin) => customPuppeteer.use(plugin));
            // DETERMINE BROWSER DATA DIRECTORY
            let chromeUserDataDir = (_d = (_b = process.env.CHROME_USER_DATA_DIR) !== null && _b !== void 0 ? _b : (_c = browserConfig.puppeteerParams) === null || _c === void 0 ? void 0 : _c.userDataDir) !== null && _d !== void 0 ? _d : 'chrome-default-user-data-dir';
            const userDataDirName = (_e = this.username) !== null && _e !== void 0 ? _e : uuid_1.v4();
            const userDataDir = path.join(chromeUserDataDir, userDataDirName);
            // LAUNCH BROWSER
            console.log(`LAUNCH BROWSER: ${userDataDir}`);
            const launchOptions = Object.assign(Object.assign(Object.assign({}, browserConfig.puppeteerParams), browserConfig), { userDataDir });
            console.log(`LAUNCH OPTIONS: ${JSON.stringify(launchOptions, null, 2)}`);
            return yield customPuppeteer.launch(launchOptions);
        });
    }
    /**
     * Tells the bot that it was used for authentication. Updates {@link Bot.usageTimeStamps}
     *
     * @remarks
     * The bot can use this information to calculate its usage-rate w.r.t its rate-limit.
     *
     * @beta
     */
    wasUsed() {
        const now = Date.now();
        this.usageTimeStamps.push(now);
        this.usageTimeStamps = this.usageTimeStamps.filter(ts => (now - ts) <= ONE_HOUR);
    }
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
    foundLogin(found) {
        this.hitCount += 1;
        if (found === true) {
            this.loginCount += 1;
        }
    }
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
    foundCaptcha(found) {
        this.hitCount += 1;
        if (found === true) {
            this.captchaCount += 1;
        }
    }
    /**
     * Returns the number of times this was used in the last hour
     *
     * @returns The number of times this bot was used in the last hour
     */
    getUsage() {
        const now = Date.now();
        return this.usageTimeStamps.filter(ts => (now - ts) <= ONE_HOUR).length;
    }
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
    isBelowRateLimit() {
        if (this.rateLimit === 0) {
            return true;
        }
        return this.getUsage() < this.rateLimit;
    }
    /**
     * Get the login hit-rate percentage of the bot
     *
     * @returns number of times the login hit-rate percentage of the bot
     *
     * @beta
     */
    getLoginHitCount() {
        return 100 * this.loginCount / this.hitCount;
    }
    /**
     * Get the captcha hit-rate percentage of the bot
     *
     * @returns number of times the captcha hit-rate percentage of the bot
     *
     * @beta
     */
    getCaptchaHitCount() {
        return 100 * this.captchaCount / this.hitCount;
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map