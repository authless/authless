"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anonBot_1 = require("../../src/bots/anonBot");
const bot_1 = require("../../src/bots/bot");
const botRouter_1 = require("../../src/bots/botRouter");
// ----------------------------------------------------------------
// --------------------------- setup ------------------------------
const urls1 = ['https://example.com/domain-1', 'https://example.com/domain-2'];
const urls2 = ['https://example.com/subdomain/'];
const defaultBotConfig = {
    urls: [],
    rateLimit: 100,
    browserConfig: {
        proxy: {
            address: '124.100.100.100',
            port: 9999,
            credentials: {
                username: 'proxy_username',
                password: 'proxy_password'
            }
        }
    }
};
const bot1 = new bot_1.Bot(Object.assign(Object.assign({}, defaultBotConfig), { urls: urls1, credentials: { username: 'user1', password: 'pass1' } }));
const bot2 = new bot_1.Bot(Object.assign(Object.assign({}, defaultBotConfig), { urls: urls2, rateLimit: 3, credentials: { username: 'user2', password: 'pass2' } }));
const bot3 = new bot_1.Bot(Object.assign(Object.assign({}, defaultBotConfig), { urls: urls2, rateLimit: 10, credentials: { username: 'user3', password: 'pass3' } }));
const botRouter = new botRouter_1.BotRouter([bot1, bot2, bot3]);
// ------------------------- end setup ----------------------------
// ----------------------------------------------------------------
test('create botRouter with multiple bots', () => {
    const br = new botRouter_1.BotRouter([bot1, bot2]);
    expect(br).toBeDefined();
});
test('get bot when bots is not empty', () => {
    const nonEmptyBot = botRouter.getBotForUrl('https://example.com/domain-1');
    expect(nonEmptyBot).toBeInstanceOf(bot_1.Bot);
    if (nonEmptyBot instanceof bot_1.Bot) {
        expect(nonEmptyBot.username).toBe('user1');
    }
});
test('get bot when bots is empty', () => {
    const noBot = botRouter.getBotForUrl('https://example.com/unknown-domain');
    expect(noBot).toBeInstanceOf(anonBot_1.AnonBot);
});
test('getBotByUsername when username is available', () => {
    const bot = botRouter.getBotByUsername('user2');
    expect(bot).toBeInstanceOf(bot_1.Bot);
    if (bot instanceof bot_1.Bot) {
        expect(bot.urls).toContain(urls2[0]);
    }
});
test('getBotByUsername when username is not available', () => {
    const bot = botRouter.getBotByUsername('unknown-user');
    expect(bot).toBeInstanceOf(anonBot_1.AnonBot);
});
test('bots are returned based on usage and rate limits', () => {
    // 'user2' has a rate-limit of 3. user3 has a rate-limit of 10
    // it takes 6 tries to use up 'user2' for an hour
    // after that only 'user3' should be returned for 7 tries.
    // any requests for a bot after that should return an AnonBot()
    // use up 3 of 'user2' and 3 of 'user3'
    Array(6).fill(1).forEach((x, index) => {
        var _a;
        expect(['user2', 'user3'].includes((_a = botRouter.getBotForUrl(urls2[0]).username) !== null && _a !== void 0 ? _a : 'anon')).toBeTruthy();
    });
    // user2: isBelowRateLimit is false, used up
    expect(botRouter.getBotByUsername('user2').isBelowRateLimit()).toBeFalsy();
    // user3: isBelowRateLimit is true, 7 left this hour
    expect(botRouter.getBotByUsername('user3').isBelowRateLimit()).toBeTruthy();
    // use up 7 of 'user3' which should total to its rate of 10
    Array(7).fill(1).forEach((x, index) => {
        expect(botRouter.getBotForUrl(urls2[0]).username).toBe('user3');
    });
    // user2: isBelowRateLimit is false, used up
    expect(botRouter.getBotByUsername('user2').isBelowRateLimit()).toBeFalsy();
    // user3: isBelowRateLimit is false, used up
    expect(botRouter.getBotByUsername('user3').isBelowRateLimit()).toBeFalsy();
    // no more bots left with their below rate limit
    // only AnonBot() instances wil be returned
    Array(7).fill(1).forEach((x, index) => {
        expect(botRouter.getBotForUrl(urls2[0])).toBeInstanceOf(anonBot_1.AnonBot);
    });
});
//# sourceMappingURL=botRouter.spec.js.map