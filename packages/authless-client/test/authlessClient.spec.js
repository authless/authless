/* eslint-env node, mocha */
const assert = require('assert');
const { Client, ClientLowLevel } = require('../src');
const { Router } = require('@authless/core');
const { ServiceDefault } = require('@authless/core');

const authlessDefault = new ServiceDefault();

describe('Client', () => {
  let authlessClient, authlessLowLevelClient;
  before(() => {
    authlessLowLevelClient = new ClientLowLevel({
      retries: 0,
      uri: 'http://example.com:4000',
    });
  });

  describe('new', () => {
    it('returns authlessClient instance', () => {
      authlessClient = new Client({
        lowLevelClient: authlessLowLevelClient,
        retries: 1,
        router: new Router([...authlessDefault.getRoutes()])
      });
      assert.equal(authlessClient instanceof Client, true);
    });
  });
});
