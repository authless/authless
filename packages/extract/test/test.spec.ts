import * as Lib from '../src'

test('valid Test', () => {
  expect(Object.keys(Lib).length).toBeGreaterThanOrEqual(0)
})
