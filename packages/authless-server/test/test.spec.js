/* eslint-env node, mocha */
const { Server } = require('../src/index.js');
const { Router, ServiceDefault } = require('@authless/core');

describe('@authless/server', () => {
  it('can instantiate a server', () => {
    const server = new Server();
  });

  it('runs', () => {
    const serviceDefault = new ServiceDefault();
    const server = new Server({
      router: new Router([
        ...serviceDefault.getRoutes()
      ])
    });
    server.run();
  });
});
