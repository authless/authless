"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-classes-per-file */
const src_1 = require("../src");
class TestResponse extends src_1.Response {
    /* eslint-disable-next-line class-methods-use-this */
    toResources() {
        const resources = [
            new TestResource(),
            new TestResource(),
        ];
        return new TestResourceCollection(src_1.ResourceConstructor.toHashResourcePair(resources));
    }
}
class TestResource extends src_1.Resource {
}
class TestResourceCollection extends src_1.ResourceCollection {
}
describe('Response', () => {
    test('it can be initialized', () => {
        const response = new TestResponse({
            meta: {
                timestamp: 1583140599365
            }
        });
        expect(response.meta.timestamp).toBe(1583140599365);
    });
    test('it transforms to ResourceCollection', () => {
        const response = new TestResponse({
            meta: {
                timestamp: 1583140599365
            }
        });
        const resources = response.toResources();
        expect(resources).toBeInstanceOf(TestResourceCollection);
    });
});
//# sourceMappingURL=response.spec.js.map