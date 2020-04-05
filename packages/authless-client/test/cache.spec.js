/* eslint-env node, mocha */
const { Cache } = require('../src');
const { expect } = require('chai');
const VError = require('verror');

describe('Cache', () => {
  describe('constructor', () => {
    context('valid', () => {
      it('returns proper cache instance', () => {
        let cache = new Cache({
          name: 'test',
          existsFn: () => true,
          retrieveFn: () => true,
          storeFn: () => true,
          removeFn: () => true
        });
        expect(cache.name).equal('test');
        expect(cache.existsFn).to.be.a('function');
        expect(cache.retrieveFn).to.be.a('function');
        expect(cache.storeFn).to.be.a('function');
        expect(cache.removeFn).to.be.a('function');
        expect(cache.debug).to.be.a('function');
      });
    });

    context('invalid', () => {
      it('throws', () => {
        expect(() => new Cache()).to.throw(VError, 'expected param:config');
      });
    });
  });
});
