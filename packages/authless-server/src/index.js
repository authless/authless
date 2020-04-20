const Express = require('express');
const debug = require('debug')('authlessServer');
const bodyParser = require('body-parser')
const ExpressRoutes = require('../server/routes.js');

class Server {
  constructor (config = {}) {
    // todo: validate config
    this.express = new Express(config.express || {});
    Object.assign(this, config);
  }

  async run () {
    this.express.use(bodyParser.json({ type: 'application/json' }));

    // Logger
    this.express.use((req, res, next) => {
      debug.extend(req.method)(req.url);
      next();
    });

    ExpressRoutes(this.express, this.router);
    this.express.get('/', async (req, res) => res.send('Hello World'));

    // Error Handler
    this.express.use((err, req, res, next) => {
      let error = debug;
      if (err.account) error = error.extend(err.account.getRateLimitId())
      error = error.extend('error');
      error(err);
      if (!err.statusCode) err.statusCode = 500;
      if (err.page) {
        res.status(err.statusCode).send(err.page);
      } else {
        res.status(err.statusCode).send(err.message);
      }
    });

    this.express.listen(3000, () => debug('started'));
  }
}



module.exports = { Server };
