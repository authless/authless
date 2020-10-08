"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-env node, jest */
const src_1 = require("../src");
describe('Client', () => {
    let authlessClient = null;
    describe('new', () => {
        test('rejects incorrect constructor config', () => {
            const invalidConfig = {
                serverUri: 'http://example.com:4000',
                retries: 's',
            };
            expect(() => new src_1.Client(invalidConfig)).toThrow();
        });
        test('returns authlessClient instance', () => {
            authlessClient = new src_1.Client({
                serverUri: 'http://example.com:4000',
                retries: 1,
            });
            expect(authlessClient).toBeInstanceOf(src_1.Client);
        });
    });
});
//# sourceMappingURL=authlessClient.spec.js.map