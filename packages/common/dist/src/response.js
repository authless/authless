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
exports.Response = void 0;
const mapper_1 = require("./mapper");
/**
 * see {@link IResponse}
 *
 * @beta
 */
class Response {
    constructor(serializedResponse) {
        this.meta = serializedResponse.meta;
        this.page = serializedResponse.page;
        this.main = serializedResponse.main;
        this.xhrs = serializedResponse.xhrs;
    }
    /**
     * see {@link IResponse.toResources}. Needs to be implemented by services.
     */
    /* eslint-disable-next-line class-methods-use-this */
    toResources() {
        throw new Error('not implemented yet');
    }
    /**
     * Construct a {@link Response} instance from the puppeteer page
     *
     * @remarks
     *
     * Override this to add custom data/metadata to your Authless response {@link IResponse}.
     *
     * @param   page - the puppeteer page from which to extract the response object
     * @param   mainResponse - the main puppeteer response from which to extract the Xhr object {@link Xhr}
     *
     * @returns the generated {@link Response}
     */
    /* eslint-disable-next-line max-params */
    static fromPage(bot, page, mainResponse, xhrResponses) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return new Response({
                meta: {
                    timestamp: Date.now(),
                    username: (_a = bot.username) !== null && _a !== void 0 ? _a : 'anonymous',
                },
                page: yield mapper_1.Mapper.page.toObject(page),
                main: yield mapper_1.Mapper.response.toObject(mainResponse),
                xhrs: yield Promise.all(xhrResponses.map((response) => __awaiter(this, void 0, void 0, function* () { return yield mapper_1.Mapper.response.toObject(response); })))
            });
        });
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map