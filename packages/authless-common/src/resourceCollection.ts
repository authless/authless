import { IResource } from './resource'

/**
 * Holds none, one, or many {@link IResource | Resources} and is usually created
 * via {@link IResponse.toResources}.
 *
 * @beta
 */
export interface IResourceCollection<T extends IResource> {

  /**
   * Create an Array of {@link IResource | Resources}. Omits keys.
   */
  toArray (): T[]
}

/**
 * Abstract implementation of {@link IResourceCollection}. Extends {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}.
 *
 * @beta
 */
export abstract class ResourceCollection<T extends IResource> extends Map<string, T> {

  /**
   * see {@link IResourceCollection}
   */
  toArray (): T[] {
    return Array.from(this.values())
  }
}
