"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("../../src/bots/bot");
const urls = ['www.example.com'];
const botConfig = {
    credentials: {
        username: 'username',
        password: 'password'
    },
    urls,
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
describe('Bot', () => {
    test('Bot is instantiated correctly', () => {
        const bot = new bot_1.Bot(botConfig);
        expect(bot).toBeDefined();
    });
    test('Bot launches browser correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const bot = new bot_1.Bot(botConfig);
        const browser = yield bot.launchBrowser();
        yield browser.close();
    }));
    test('Bot launches multiple browser simultaneously correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const bots = [
            new bot_1.Bot(botConfig),
            new bot_1.Bot(botConfig),
            new bot_1.Bot(botConfig)
        ];
        const browsers = yield Promise.all(bots.map((bot) => __awaiter(void 0, void 0, void 0, function* () {
            return yield bot.launchBrowser();
        })));
        yield Promise.all(browsers.map((browser) => __awaiter(void 0, void 0, void 0, function* () {
            return yield browser.close();
        })));
    }));
    // -- login hit count
    test('Login hit count is correctly calculated', () => {
        // simulating 100% login hit count
        const bot1 = new bot_1.Bot(botConfig);
        bot1.foundLogin(true);
        bot1.foundLogin(true);
        bot1.foundLogin(true);
        bot1.foundLogin(true);
        bot1.foundLogin(true);
        expect(bot1.getLoginHitCount()).toBe(100);
        // simulating 40% login hit count
        const bot2 = new bot_1.Bot(botConfig);
        bot2.foundLogin(true);
        bot2.foundLogin(true);
        bot2.foundLogin(false);
        bot2.foundLogin(false);
        bot2.foundLogin(false);
        expect(bot2.getLoginHitCount()).toBe(40);
    });
    test('Captcha hit count is correctly calculated', () => {
        // simulating 100% login hit count
        const bot1 = new bot_1.Bot(botConfig);
        bot1.foundCaptcha(true);
        bot1.foundCaptcha(true);
        bot1.foundCaptcha(true);
        bot1.foundCaptcha(true);
        bot1.foundCaptcha(true);
        expect(bot1.getCaptchaHitCount()).toBe(100);
        // simulating 60% login hit count
        const bot2 = new bot_1.Bot(botConfig);
        bot2.foundCaptcha(true);
        bot2.foundCaptcha(true);
        bot2.foundCaptcha(true);
        bot2.foundCaptcha(false);
        bot2.foundCaptcha(false);
        expect(bot2.getCaptchaHitCount()).toBe(60);
    });
    test.skip('Rate limiting works ', () => {
        const bot = new bot_1.Bot(botConfig);
        expect(bot).toBeDefined();
    });
});
//# sourceMappingURL=bot.spec.js.map