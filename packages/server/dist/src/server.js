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
exports.Server = void 0;
const core = __importStar(require("@authless/core"));
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
/**
 * Helper class to start your running Authless server
 *
 * @remarks
 * This class can be used to create a configurable puppeteer instance with
 * some built-in functionality and plugins
 *
 * @example
 * ```ts
 * await browser = Server.launchBrowser(myDomainPath, myBot, {puppeteerParams, puppeteerPlugins, ..})
 * await page = browser.newPage()
 *
 * await domainPath.pageHandler(page, ..)
 * ```
 *
 * @beta
 */
class Server {
    /**
     * Create a Authless server instance
     *
     * @beta
     */
    constructor(config) {
        this.botRouter = config.botRouter;
        this.domainPathRouter = config.domainPathRouter;
        this.puppeteerParams = config.puppeteerParams;
        this.puppeteerPlugins = config.puppeteerPlugins;
        this.proxy = config.proxy;
    }
    static ping(expressRequest, expressResponse) {
        var _a, _b;
        const name = (_a = expressRequest.query.name) !== null && _a !== void 0 ? _a : 'anonymous user';
        if (typeof name !== 'string') {
            const error = `error: url must be provided as a query parameter string. invalid value: ${(_b = name === null || name === void 0 ? void 0 : name.toLocaleString()) !== null && _b !== void 0 ? _b : 'undefined'}`;
            console.log(error);
            expressResponse
                .status(422)
                .send(error)
                .end();
            return;
        }
        expressResponse
            .status(200)
            .send(`hello ${name}`)
            .end();
    }
    static speedtest(expressRequest, expressResponse) {
        // start puppeteer with this.puppeteerParams
        // run speedtest
        expressResponse
            .send(JSON.stringify({ 'speed': '1000' }))
            .end();
    }
    scrape(expressRequest, expressResponse) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urlParams = expressRequest.query;
                const { url, username } = urlParams;
                if (typeof url !== 'string') {
                    throw new Error(`url must be provided as a query parameter string. invalid value: ${(_a = url === null || url === void 0 ? void 0 : url.toLocaleString()) !== null && _a !== void 0 ? _a : 'undefined'}`);
                }
                // try to fetch the sevice for this url
                const selectedDomainPath = this.domainPathRouter.getDomainPath(url);
                if (typeof selectedDomainPath === 'undefined') {
                    throw new Error(`no DomainPath handler found for ${url}`);
                }
                // get bot when username not provided explicitly
                let selectedBot = this.botRouter.getBotForUrl(url);
                // get bot when username is provided
                if (typeof username === 'string') {
                    selectedBot = this.botRouter.getBotByUsername(username);
                    if (selectedBot instanceof core.AnonBot) {
                        throw new Error(`unable to find bot with username ${username}`);
                    }
                }
                // initialise the browser
                const browser = yield selectedBot.launchBrowser({
                    puppeteerParams: this.puppeteerParams,
                    puppeteerPlugins: this.puppeteerPlugins,
                    proxy: this.proxy
                });
                const page = yield browser.newPage();
                try {
                    yield page.evaluateOnNewDocument(() => {
                        /* eslint-disable-next-line no-proto */
                        const newProto = navigator.__proto__;
                        /* eslint-disable-next-line prefer-reflect */
                        delete newProto.webdriver;
                        /* eslint-disable-next-line no-proto */
                        navigator.__proto__ = newProto;
                    });
                    if (typeof ((_b = this.puppeteerParams) === null || _b === void 0 ? void 0 : _b.viewPort) !== 'undefined') {
                        yield page.setViewport((_c = this.puppeteerParams) === null || _c === void 0 ? void 0 : _c.viewPort);
                    }
                    let responseFormat = 'json';
                    if ((urlParams === null || urlParams === void 0 ? void 0 : urlParams.responseFormat) === 'png') {
                        responseFormat = urlParams === null || urlParams === void 0 ? void 0 : urlParams.responseFormat;
                    }
                    // let service handle the page
                    const authlessResponse = yield selectedDomainPath.pageHandler(page, selectedBot, {
                        urlParams: { url, responseFormat },
                        puppeteerParams: this.puppeteerParams
                    });
                    if (responseFormat === 'json') {
                        expressResponse
                            .status(200)
                            .set('Content-Type', 'application/json; charset=utf-8')
                            .send({
                            meta: authlessResponse.meta,
                            page: authlessResponse.page,
                            main: authlessResponse.main,
                            xhrs: authlessResponse.xhrs,
                        })
                            .end();
                    }
                    else if (responseFormat === 'png') {
                        expressResponse
                            .status(200)
                            .set('Content-Type', 'image/png')
                            .end(yield page.screenshot({ fullPage: true }), 'binary');
                    }
                    else {
                        expressResponse
                            .status(501)
                            .end('Can only handle responseFormat of type json or png');
                    }
                }
                catch (err) {
                    console.log(err.stack);
                    const screenshotPath = `/tmp/${uuid_1.v4()}.png`;
                    yield page.screenshot({ path: screenshotPath });
                    console.log(`saved error screenshot to: ${screenshotPath}`);
                    expressResponse.status(501).send('Server Error').end();
                }
                finally {
                    yield page.close();
                    yield browser.close();
                }
                try {
                    yield page.close();
                    yield browser.close();
                }
                catch (_) { }
            }
            catch (error) {
                console.log(`UNEXPECTED ERROR: ${error.stack}`);
                expressResponse.status(500).send(error.stack).end();
            }
        });
    }
    run() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const app = express_1.default();
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded());
            const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
            app.get('/ping', Server.ping);
            app.get('/speedtest', Server.speedtest);
            app.get('/url', (req, res) => __awaiter(this, void 0, void 0, function* () { return yield this.scrape(req, res); }));
            // start express
            return yield new Promise((resolve, reject) => {
                try {
                    const server = app.listen(PORT, () => {
                        console.log(`Listening on port ${PORT}`);
                        resolve(server);
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map