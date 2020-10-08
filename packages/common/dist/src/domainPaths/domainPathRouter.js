"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainPathRouter = void 0;
/**
 * Manages a pool of {@link DomainPath} mapped to an url each
 *
 * @beta
 */
class DomainPathRouter {
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
    constructor(domainMap) {
        this.domainMap = domainMap;
    }
    /**
     * Add DomainPaths from another DomainPathRouter
     */
    addDomainPathRouter(router) {
        this.domainMap = Object.assign(Object.assign({}, this.domainMap), router.domainMap);
    }
    /**
     * returns a {@link DomainPath} that matches the url, else returns undefined
     *
     * @param url - the HTTP URL which is to be fetched
     * @returns a {@link DomainPath} if found, else returns undefined
     *
     */
    getDomainPath(url) {
        const matchedUrlKeys = Object.keys(this.domainMap)
            .sort((a, b) => b.length - a.length)
            .filter(domainUrl => url.includes(domainUrl));
        if (matchedUrlKeys.length > 0) {
            return this.domainMap[matchedUrlKeys[0]];
        }
    }
}
exports.DomainPathRouter = DomainPathRouter;
//# sourceMappingURL=domainPathRouter.js.map