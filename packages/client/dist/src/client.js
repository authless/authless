"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const VError = require("verror");
const axios_1 = require("axios");
const debug_1 = require("./debug");
const debug = debug_1.default.extend('client');
class Client {
    constructor(config) {
        var _a;
        try {
            if (Client.isValidConfig(config)) {
                this.serverUri = config.serverUri;
                this.retries = config.retries;
                this.axios = (_a = config.axios) !== null && _a !== void 0 ? _a : axios_1.default;
            }
            Object.assign(this, config);
        }
        catch (e) {
            throw new VError(e, 'failed to initialize Client');
        }
    }
    static isValidConfig(x) {
        if (!(x instanceof Object) || x === null)
            throw new Error('config must be a javascript object');
        if (typeof x.serverUri !== 'string')
            throw new Error('config.serverUri must be a string');
        if (typeof x.retries !== 'number')
            throw new Error('config.retries must be a number');
        return true;
    }
    url(params, retryCounter = 0) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug.extend('url')(params.url);
            params.responseFormat = (_a = params.responseFormat) !== null && _a !== void 0 ? _a : 'json';
            try {
                const data = yield this.axios.get(`${this.serverUri}/url`, { params })
                    .then(response => response.data);
                return data;
            }
            catch (e) {
                if (retryCounter < this.retries) {
                    debug.extend('url').extend('error')(`retry/${retryCounter + 1}: ${e.message}`);
                    return this.url(params, retryCounter + 1);
                }
                debug.extend('url').extend('error')(`retried ${this.retries} times; its not working`);
                const statusCode = e.response.status;
                const statusText = e.response.statusText;
                const paramsString = JSON.stringify(e.config.params, null, 2);
                console.log(`(${statusCode} - ${statusText}) for "${e.config.url}" with "${paramsString}"`);
                throw e;
            }
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map