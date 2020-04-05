/* eslint-env node, mocha */
const assert = require('assert');
const { ClientLowLevel } = require('../src');

describe('ClientLowLevel', () => {
  let authlessLowLevelClient;
  describe('new', () => {
    it('returns ClientLowLevel instance', () => {
      authlessLowLevelClient = new ClientLowLevel({
        retries: 1,
        uri: 'http://example.com:4000'
      });
      assert.equal(authlessLowLevelClient instanceof ClientLowLevel, true);
    });
  });
});
