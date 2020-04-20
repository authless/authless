const ExpressRouter = require('express');
const FastSpeedtest = require('fast-speedtest-api');
const Limiter = require('async-ratelimiter');
const Redis = require('ioredis');
const lib = require('../package.json');
const delay = require('delay');
const {
  Authless,
  Account
} = require('@authless/core');
const debug = require('debug')('authlessServer');
const { ServerError } = require('../serverError');

// Make sure to `.catch()` any errors and pass them along to the `next()`
// middleware in the chain, in this case the error handler.
const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const getAccountFromRequest = (authless, req) => {
  if (req.query.account) return authless.findAccountById(req.query.account)
  return authless.findAccountByUrl(req.query.u);
}

const slowScrollToBottom = async () => {
  await new Promise((resolve, reject) => {
    let totalHeight = 0;
    const distance = 100;
    const initialScrollHeight = document.body.scrollHeight;
    const timer = setInterval(() => {
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;

      if(totalHeight >= scrollHeight || (initialScrollHeight * 6) <= scrollHeight){
        clearInterval(timer);
        resolve();
      }
    }, 300);
  });
}

const convertRequestToJson = async (request, _redirectChain = false) => {
  const obj = {
    headers: request.headers(),
    isNavigationRequest: request.isNavigationRequest(),
    method: request.method(),
    postData: request.postData(),
    resourceType: request.resourceType(),
    url: request.url()
  };
  if (_redirectChain) {
    try {
      obj.redirectChain = await request.redirectChain().map(convertRequestToJson);
    } catch (e) {
      console.log('An error occured while parsing Request to JSON (redirectChain): ' + e.message);
    }
  }
  return obj;
}

const convertPageToJson = async (page) => {
  const obj = {
    url: page.url(),
    viewport: page.viewport()
  };
  try { obj.content = await page.content() } catch (_) { }
  try { obj.cookies = await page.cookies() } catch (_) { }
  try { obj.title = await page.title() } catch (_) { }
  return obj;
}

const convertResponseToJson = async (response) => {
  const obj = {
    url: response.url(),
    status: response.status(),
    statusText: response.statusText(),
    headers: response.headers(),
    securityDetails: response.securityDetails(),
    fromCache: response.fromCache(),
    fromServiceWorker: response.fromServiceWorker()
  };
  try { obj.text = await response.text() } catch (_) { }
  try { obj.request = await convertRequestToJson(response.request(), false) } catch (e) {
    console.log('An error occured while parsing Request to JSON: ' + e.message);
  }
  return obj;
};

const convertResponsesToJson = async responses => {
  return Promise.all(responses.map(async r => convertResponseToJson(r)));
}

const getJsonResponse = async (account, page, response, responses) => {
  const result = {
    meta: {
      account: account.getRateLimitId(),
      time: Date.now()
    },
    content: await page.content(),
    page: await convertPageToJson(page),
    xhrs: await Promise.all(responses)
  };
  if (response) result.main = await convertResponseToJson(response);
  return result;
}

const redis = new Redis({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || '127.0.0.1',
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0
});

const getPersonRoutes = (app, authlessRouter) => {
  const authless = new Authless(authlessRouter);
  const router = new ExpressRouter();

  router.
    get('/health', async (_, res) => {
      const obj = {};
      const rateLimitsPerAccount = {};
      const accounts = authless.listAccounts();
      const accObjects = await Promise.all(accounts.map(async account => {
        return {
          id: account.getRateLimitId(),
          stats: {
            ...await account.getRateLimitStatus(),
            ...{ health: (account._errorPage) ? 'unhealthy' : 'healthy' }
          }
        }
      }));
      accObjects.forEach(accObj => rateLimitsPerAccount[accObj.id] = accObj.stats)
      obj.rateLimits = rateLimitsPerAccount;
      obj.status = 'healthy';
      obj.version = lib.version;
      res.status(200).send(obj);
    }).

    /**
     * Example request
     * /url?u=https://google.com&
     *   responseFormat=json|png|html(default: html)&
     *   account=service:username
     */
    get('/url', wrapAsync(async (req, res) => {
      if (!req.query.u) throw new Error(`Request had no 'u' parameter specified`);
      req.query.u               = decodeURIComponent(req.query.u);
      req.query.responseFormat  = req.query.responseFormat || 'html';

      const account             = getAccountFromRequest(authless, req);
      return authless.useBrowserWithAccount(account, async browser => {
        const responses = [];

        const page = await browser.newPage();
        try {
          if (!await account.isAuthenticated(page)) await account.authenticate(page)

          switch (await account.isThrottled()) {
            case true: throw new ServerError('Account is throttled', {account});
            default: await account.decreaseRateLimitBy1();
          }

          const writeToResponse = async response => {
            return responses.push(await convertResponseToJson(response));
          }
          page.on('response', writeToResponse);
          const response = await page.goto(req.query.u, {timeout: 0, waitUntil: 'networkidle2'});
          await page.evaluate(slowScrollToBottom);
          await delay(500);
          if (page.url().includes('login') || page.url().includes('authenticate')) {
            throw new ServerError(`Requires login to access: ${req.query.u}`, {
              account,
              pageUrl: page.url()
            });
          }

          // Check if there are more things to expand
          const expandAllLinks = async (expression, timeout = 250) => {
            const handles = await page.$x(`//button[contains(text(), '${expression}')]`);
              if (handles.length > 0) {
                await handles.shift().click();
                await delay(timeout);
                // check for more
                return expandAllLinks(expression, timeout);
              }
              return true;
            }
          await expandAllLinks('more experience', 500);
          await expandAllLinks('more education');
          await expandAllLinks('more position');

          page.removeListener('response', writeToResponse);
          if (req.query.responseFormat === 'json') {
            res.set('Content-Type', 'application/json');
            const jsonResponse = await getJsonResponse(account, page, response, responses)
            return res.status(200).send(jsonResponse)
          } else if (req.query.responseFormat === 'png') {
            return res.end(await page.screenshot({fullPage: true}), 'binary');
          }
          res.set('Content-Type', 'text/html');
          return res.status(200).send(await page.content());
        } catch (e) {
          account._errorPage = await getJsonResponse(account, page, undefined, responses);
          throw e
        }
      });
    })).

        /**
         * Example request
         * /speedTest?account=service:username
         */
        get('/speedTest', wrapAsync(async (req, res) => {
          const account = getAccountFromRequest(authless, req);
          const fastOptions = {
            token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
            timeout: 5000,
            unit: FastSpeedtest.UNITS.Mbps
          };
          if (account.proxy) {
            fastOptions.proxy = `http://${account.proxy.address}:${account.proxy.port}`;
            if (account.proxy.credentials) {
              fastOptions.proxy = `http://${account.proxy.credentials.username}:${account.proxy.credentials.password}@${account.proxy.address}:${account.proxy.port}`;
            }
          }
          const fast = new FastSpeedtest(fastOptions);
          res.set('Content-Type', 'application/json');
          return res.status(200).send({result: await fast.getSpeed(), resultFormat: 'Mbps'});
        })).

        /**
         * Example request
         * /findRoute?u=https://google.com
         */
        get('/findRoute', wrapAsync(async (req, res) => {
          const service = authless.$getServiceFromUrl(req.query.u);
          const serviceNameParts = service.name.split(':');
          res.json({
            service: serviceNameParts[0],
            accountType: serviceNameParts[1],
          });
        })).

        /**
         * Example request
         * /doctor?account=service:accType:username&responseFormat=json(default: html)
         */
        get('/doctor', wrapAsync(async (req, res) => {
          const account = getAccountFromRequest(authless, req);
          if (req.query.responseFormat === 'json') {
            res.set('Content-Type', 'application/json');
            return res.status(200).send(account._errorPage || {});
          }
          res.set('Content-Type', 'text/html');
          return res.status(200).send((account._errorPage || {}).content || '');
        })).

        /**
         * If an account is unhealthy due to verification issues, you can verify it here
         *
         * Example request
         * /verify?account=service:accType:username&pin=123456
         */
        get('/verify', async (req, res, next) => {
          try {
            const authBrowser = authless._acquireBrowserByAccountName(req.query.account);
            try {
              await authBrowser._authenticationPage.click('#input__email_verification_pin', {});
              await authBrowser._authenticationPage.keyboard.type(req.query.pin, {delay: 20});
              await authBrowser._authenticationPage.click('#email-pin-submit-button', {waitUntil: 'networkidle2'});
            } catch (e) {
              return next(e);
            }
            await delay(7500);
            const successBoolean = authBrowser._authenticationPage.url().includes('feed');
            await authBrowser._authenticationPage.close();
            res.set('Content-Type', 'application/json');
            return res.status(200).send({success: successBoolean});
          } catch (e) {
            return next(e);
          }
        }).

        /**
         * Try to re-authenticate an account manually
         *
         * Example request
         * /authenticate?account=service:accType:username
         */
        get('/authenticate', wrapAsync(async (req, res, next) => {
          if (!req.query.account) throw new Error(`Request had no 'account' parameter specified`);
          const account = getAccountFromRequest(authless, req);
          await authless.useBrowserWithAccount(account, async browser => {
            const page = await browser.newPage();
            await account.authenticate(page)
          }).catch(next);
          return res.status(200).send(`Done. Check /health or /doctor for result`);
        })).

        /**
     Example request body
     {
       username: "admin",
       password: "1234567",
       service: "default",
       accountType: "default",
       rateLimiter: {
         max: 1000,
         duration: 24 * 60 * 60 * 1000
       },
       proxy: {
        address: "123.123.123.123",
        port: 9000,
        username: "admin",
        password: "1234567"
       }
     }
     */
        post('/account', wrapAsync(async (req, res) => {
          const accountService = req.body.service;
          const accountType = req.body.accountType;

          const account = new Account(req.body);
          // setup and attach rateLimiter
          req.body.rateLimiter.id = account.getRateLimitId();
          req.body.rateLimiter.db = redis;
          account.rateLimiter = new Limiter(req.body.rateLimiter);
          // submit account to service

          const service = authless.$getService(`${accountService}:${accountType}`);
          service.add(account);
          res.status(200).json({status: 'success'});
        }))

        app.use('', router);
      };

module.exports = getPersonRoutes;
