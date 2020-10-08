/**
 * @beta
 */
export interface IResource {
    /**
     * Creates the sha1 hash of the resource.
     *
     * @remarks
     * If the resource has noisy attributes such as trackingIDs or debugging info that is not
     * relevant to the resource as such, the implementation may decide to omit such attributes
     * to produce the same sha1 hash for resources that would e.g. otherwise have different trackingID values.
     *
     * @example
     *
     * ```ts
     * // example implementation of the sha1 function which omits the `trackingNumber` property
     * function sha1 (object): string {
     *   const clone = { ...object }
     *   Reflect.deleteProperty(clone, 'trackingNumber')
     *   return super.sha1(clone, { algorithm: 'sha1' })
     * }
     *
     * // Returns true
     * sha1({value: 1, trackingNumber: '123'}) === sha1({value: 1, trackingNumber: '456'})
     * ```
     */
    sha1(): string;
}
/**
 * @beta
 */
export declare abstract class Resource implements IResource {
    /**
     * See {@link IResource.sha1}.
     *
     * @remarks
     * Does not omit any properties of the resource
     */
    sha1(input?: this): string;
}
/**
 * @beta
 */
export declare const ResourceConstructor: {
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
    toHashResourcePair<T extends IResource>(resources: T[]): [string, T][];
};
//# sourceMappingURL=resource.d.ts.map