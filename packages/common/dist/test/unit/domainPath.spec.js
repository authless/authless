"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domainPath_1 = require("../../src/domainPaths/domainPath");
test('create domainPath', () => {
    const domainName = 'my-domain';
    const domainPath = new domainPath_1.DomainPath(domainName);
    expect(domainPath).toBeDefined();
    expect(domainPath.domain).toBe(domainName);
});
//# sourceMappingURL=domainPath.spec.js.map