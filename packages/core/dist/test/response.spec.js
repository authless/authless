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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-classes-per-file */
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
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
const responseSerialized = fs.readJsonSync(path.join(__dirname, './fixtures/fullResponsePayload.json'));
describe('Response', () => {
    test('it can be initialized', () => {
        const response = new TestResponse(responseSerialized);
        expect(response.meta.timestamp).toBe(1583140599365);
    });
    test('it transforms to ResourceCollection', () => {
        const response = new TestResponse(responseSerialized);
        const resources = response.toResources();
        expect(resources).toBeInstanceOf(TestResourceCollection);
    });
});
//# sourceMappingURL=response.spec.js.map