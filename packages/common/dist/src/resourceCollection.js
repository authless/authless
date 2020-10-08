"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCollection = void 0;
/**
 * Abstract implementation of {@link IResourceCollection}. Extends {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}.
 *
 * @beta
 */
class ResourceCollection extends Map {
    /**
     * see {@link IResourceCollection}
     */
    toArray() {
        return Array.from(this.values());
    }
}
exports.ResourceCollection = ResourceCollection;
//# sourceMappingURL=resourceCollection.js.map