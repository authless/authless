import { DomainPath } from './domainPath';
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
//# sourceMappingURL=domainPathRouter.d.ts.map