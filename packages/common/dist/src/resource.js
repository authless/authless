"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceConstructor = exports.Resource = void 0;
const object_hash_1 = __importDefault(require("object-hash"));
/**
 * @beta
 */
class Resource {
    /**
     * See {@link IResource.sha1}.
     *
     * @remarks
     * Does not omit any properties of the resource
     */
    sha1(input = this) {
        return object_hash_1.default(input, { algorithm: 'sha1' });
    }
}
exports.Resource = Resource;
/**
 * @beta
 */
exports.ResourceConstructor = {
    /**
     * Generates the `sha1` hash of any resource object and returns the sha1-resource pair.
     *
     * @remarks
     * This allows downstream tasks to easily compute a list that only contains unique
     * values by filtering out duplicate sha1 keys. See the example for usage.
     *
     * @example
     *
     * ```ts
     * // to create a ResourceCollection that has only unique and no duplicate resources
     * const resources: IResource[] = [{}, {}, ...]
     * const uniqueResourceCollection = new ResourceCollection(
     *   ResourceConstructor.toHashResourcePair(resources)
     * )
     * ```
     *
     * @returns An array for sha1-resource pairs. For example:
     *          [
     *            [ 'SHA1-1234', {@link IResource} ],
     *            [ 'SHA1-5678', {@link IResource} ],
     *          ]
     */
    toHashResourcePair(resources) {
        return resources.map(resource => {
            return [object_hash_1.default(resource.sha1(), { algorithm: 'sha1' }), resource];
        });
    }
};
//# sourceMappingURL=resource.js.map