"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domainPath_1 = require("../../src/domainPaths/domainPath");
const domainPathRouter_1 = require("../../src/domainPaths/domainPathRouter");
// ----------------------------------------------------------------
// --------------------------- setup ------------------------------
const dp1 = new domainPath_1.DomainPath('first-domainpath');
const dp2 = new domainPath_1.DomainPath('alt-domainpath');
const dp3 = new domainPath_1.DomainPath('third-domainpath');
const dpRouter = new domainPathRouter_1.DomainPathRouter({
    'https://example.com': dp1,
    'https://example.com/2': dp2,
    'https://example.com/subdomain/': dp3,
});
// ----------------------------------------------------------------
// ------------------------- end setup ----------------------------
// -- TODO - should duplicate services(same urls) be allowed?
test('create domainPathRouter', () => {
    const domainName = 'my-domain';
    const domainPath = new domainPath_1.DomainPath(domainName);
    expect(domainPath).toBeDefined();
    expect(domainPath.domain).toBe(domainName);
});
test('getDomainPath - when url is present', () => {
    const domainPath = dpRouter.getDomainPath('https://example.com');
    expect(domainPath).toBeDefined();
    expect(domainPath === null || domainPath === void 0 ? void 0 : domainPath.domain).toBe('first-domainpath');
});
test('getDomainPath - when url missing', () => {
    const domainPath = dpRouter.getDomainPath('https://example.net/invalid-url');
    expect(domainPath).toBeUndefined();
});
test('getDomainPath - find best url match', () => {
    const url = 'https://example.com/subdomain/resource-name/seo-text';
    const domainPath = dpRouter.getDomainPath(url);
    expect(domainPath).toBeDefined();
    expect(domainPath === null || domainPath === void 0 ? void 0 : domainPath.domain).toBe('third-domainpath');
});
//# sourceMappingURL=domainPathRouter.spec.js.map