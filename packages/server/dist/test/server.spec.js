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
const common = __importStar(require("@authless/common"));
const core = __importStar(require("@authless/core"));
const src_1 = require("../src");
const axios_1 = __importDefault(require("axios"));
class DefaultDomainPath extends core.DomainPath {
    pageHandler(page, selectedBot, config) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupPage(page, {});
            const mainResponse = yield page.goto((_a = config === null || config === void 0 ? void 0 : config.urlParams) === null || _a === void 0 ? void 0 : _a.url, {
                timeout: 0,
                waitUntil: 'load'
            });
            return yield common.Response.fromPage(selectedBot, page, mainResponse, this.xhrResponses);
        });
    }
}
const createServerInstance = (config = {}) => {
    const anonBot = new core.AnonBot({
        urls: [],
        browserConfig: {
            useStealthPlugin: true,
        }
    });
    return new src_1.Server({
        domainPathRouter: new core.DomainPathRouter({
            '': new DefaultDomainPath('any')
        }),
        botRouter: new core.BotRouter([anonBot]),
        puppeteerParams: Object.assign({
            headless: false,
            args: [],
            ignoreHTTPSErrors: true
        }, config),
        puppeteerPlugins: [],
    });
};
describe('Server', () => {
    const targetUrl = 'http://www.sanident.it';
    it('can start a server', () => __awaiter(void 0, void 0, void 0, function* () {
        const server = createServerInstance();
        const httpServer = yield server.run();
        httpServer.close();
    }));
    describe('usage (headless)', () => {
        let serverInstance = {};
        let httpServer = {};
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // start server
            //serverInstance = createServerInstance({headless: true, devtools: true})
            serverInstance = createServerInstance({ headless: true });
            httpServer = yield serverInstance.run();
        }));
        afterEach(() => {
            // stop server
            httpServer.close();
        });
        it('can scrape any page', () => __awaiter(void 0, void 0, void 0, function* () {
            yield axios_1.default.get(`http://localhost:3000/url?url=${encodeURIComponent(targetUrl)}`);
        }));
    });
});
//# sourceMappingURL=server.spec.js.map