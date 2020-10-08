import { Page as PuppeteerPage } from 'puppeteer';
import { PuppeteerParams, Xhr } from '../types';
import { Response as AuthlessResponse } from '../response';
import { Bot } from '../bots/bot';
/**
 * The interface that controls the behaviour and page-handling for a particular domain/subdomain/url
 *
 * @remarks
 * This is responsible for handling the page that is fetched.
 * If different behaviours are required for different URLs
 * (say some pages have pagination, while others require you to expand links)
 * then, you should have multiple DomainPaths and attach them to the requried URL
 * via a DomainPathHandler {@link DomainPathRouter}
 * Extend this class to create custom DomainPath behaviours
 * You can add custom behaviour in the getJsonResponse(), setupPage() and pageHandler() functions
 *
 * @example
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
    responses: Xhr[];
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
    setupPage(page: PuppeteerPage, puppeteerParams: PuppeteerParams): Promise<void>;
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
    pageHandler(page: PuppeteerPage, selectedBot?: Bot, config?: any): Promise<AuthlessResponse>;
}
//# sourceMappingURL=domainPath.d.ts.map