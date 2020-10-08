"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotRouter = void 0;
const anonBot_1 = require("../bots/anonBot");
/**
 * Manages a pool(zero or more) Bots {@link Bot}
 * Is responsible for rotating the bots used in a round-robin fashion.
 *
 * @beta
 */
class BotRouter {
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
    constructor(bots) {
        if (bots.length === 0) {
            throw new Error('Error: parameter "bots: Bot[]" cannot be empty as there will be no bots to route');
        }
        this.botMap = bots.reduce((acc, bot) => {
            bot.urls.forEach(url => {
                if (url in acc) {
                    acc[url] = acc[url].concat(bot);
                }
                else {
                    acc[url] = [bot];
                }
            });
            return acc;
        }, {});
    }
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
    getBotForUrl(url) {
        const matchedUrlKeys = Object.keys(this.botMap)
            .sort((a, b) => a.length - b.length)
            .filter(domainUrl => url.includes(domainUrl));
        if (matchedUrlKeys.length > 0) {
            const matchedUrl = matchedUrlKeys[0];
            if (typeof matchedUrl !== 'undefined') {
                const bots = this.botMap[matchedUrl];
                const usableBots = bots
                    .filter(bot => bot.isBelowRateLimit())
                    .sort((a, b) => a.getUsage() - b.getUsage());
                if (usableBots.length > 0) {
                    usableBots[0].wasUsed();
                    return usableBots[0];
                }
            }
        }
        return new anonBot_1.AnonBot();
    }
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
    getBotByUsername(name) {
        var _a;
        const matchedBotData = Object.values(this.botMap).find(botsData => {
            return typeof botsData.find(bot => bot.username === name) !== 'undefined';
        });
        return (_a = matchedBotData === null || matchedBotData === void 0 ? void 0 : matchedBotData.find(bot => bot.username === name)) !== null && _a !== void 0 ? _a : (new anonBot_1.AnonBot());
    }
}
exports.BotRouter = BotRouter;
//# sourceMappingURL=botRouter.js.map