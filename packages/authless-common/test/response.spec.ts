/* eslint-disable max-classes-per-file */
import {
  Resource,
  ResourceCollection,
  ResourceConstructor,
  Response
} from '../src'

class TestResponse extends Response {
  /* eslint-disable-next-line class-methods-use-this */
  toResources (): TestResourceCollection {
    const resources: TestResource[] = [
      new TestResource(),
      new TestResource(),
    ]
    return new TestResourceCollection(
      ResourceConstructor.toHashResourcePair(resources)
    )
  }
}

class TestResource extends Resource {

}

class TestResourceCollection extends ResourceCollection<TestResource> {

}

describe('Response', () => {
  test('it can be initialized', () => {
    const response = new TestResponse({
      meta: {
        timestamp: 1583140599365
      }
    })
    expect(response.meta.timestamp).toBe(1583140599365)
  })

  test('it transforms to ResourceCollection', () => {
    const response = new TestResponse({
      meta: {
        timestamp: 1583140599365
      }
    })
    const resources = response.toResources()
    expect(resources).toBeInstanceOf(TestResourceCollection)
  })
})
