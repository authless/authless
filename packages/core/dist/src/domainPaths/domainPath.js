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
exports.DomainPath = void 0;
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
class DomainPath {
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
    constructor(domain) {
        this.domain = domain;
        this.xhrResponses = [];
    }
    addResponseHook(page, blockResourceTypes) {
        console.log(`-- setting up to block resourceTypes: ${JSON.stringify(blockResourceTypes)}`);
        const saveResponse = (response) => __awaiter(this, void 0, void 0, function* () {
            const request = response.request();
            if (!blockResourceTypes.includes(request.resourceType())) {
                this.xhrResponses.push(response);
            }
        });
        // attach handler to save responses
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        page.on('response', saveResponse);
    }
    // eslint-disable-next-line class-methods-use-this
    addRequestBlockers(page, blockedDomains) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`-- setting up to block requests from domains: ${JSON.stringify(blockedDomains)}`);
            // block any domains we dont want to load from
            yield page.setRequestInterception(true);
            page.on('request', (request) => {
                if (blockedDomains.filter(urlPart => request.url().includes(urlPart)).length > 0) {
                    request.abort()
                        .then(() => {
                        console.log(`blocked request from ${request.url()}`);
                    })
                        .catch((err) => {
                        console.log(`error blocking request from ${request.url()}: ${JSON.stringify(err)}`);
                    });
                }
                else {
                    request.continue()
                        .catch(() => {
                        console.log('error calling request.continue()');
                    });
                }
            });
        });
    }
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
    setupPage(page, puppeteerParams) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (puppeteerParams === null || puppeteerParams === void 0 ? void 0 : puppeteerParams.viewPort) !== 'undefined') {
                yield page.setViewport(puppeteerParams.viewPort);
            }
            // add hooks to save responses
            this.addResponseHook(page, (_a = puppeteerParams.blockResourceTypes) !== null && _a !== void 0 ? _a : []);
            // add request blockers for domains to ignore
            if (typeof puppeteerParams.blockDomains !== 'undefined' &&
                puppeteerParams.blockDomains.length > 0) {
                yield this.addRequestBlockers(page, puppeteerParams.blockDomains);
            }
        });
    }
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
    // eslint-disable-next-line class-methods-use-this
    pageHandler(page, selectedBot, config) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.DomainPath = DomainPath;
//# sourceMappingURL=domainPath.js.map