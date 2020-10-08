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
     * Create a {@link RequestContainer} JSON structure from the puppeteer request
     *
     * @param request - The puppeteer request from which to form the {@link RequestContainer}
     * @returns
     * A {@link RequestContainer} if possible, throws on error
     */
    static convertRequestToJson(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestData = {
                    headers: request.headers(),
                    isNavigationRequest: request.isNavigationRequest(),
                    method: request.method(),
                    postData: request.postData(),
                    resourceType: request.resourceType(),
                    url: request.url()
                };
                return requestData;
            }
            catch (e) {
                console.log('error: unable to extract request data from Xhr response');
                throw e;
            }
        });
    }
    /**
     * Convert a puppeteer page response into a JSON object of type {@link Xhr}
     *
     * @param response - The puppeteer response from which to generate the {@link Xhr} JSON object
     * @returns
     * A JSON object with the response metadata and content {@link Xhr}
     */
    static convertResponseToJson(response) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const securityDetails = {
                issuer: (_a = response.securityDetails()) === null || _a === void 0 ? void 0 : _a.issuer(),
                protocol: (_b = response.securityDetails()) === null || _b === void 0 ? void 0 : _b.protocol(),
                subjectName: (_c = response.securityDetails()) === null || _c === void 0 ? void 0 : _c.subjectName(),
                validFrom: (_d = response.securityDetails()) === null || _d === void 0 ? void 0 : _d.validFrom(),
                validTo: (_e = response.securityDetails()) === null || _e === void 0 ? void 0 : _e.validTo(),
            };
            const returnObj = {
                url: response.url(),
                status: response.status(),
                statusText: response.statusText(),
                headers: response.headers(),
                securityDetails: securityDetails,
                fromCache: response.fromCache(),
                fromServiceWorker: response.fromServiceWorker(),
                // eslint-disable-next-line no-undefined
                text: undefined,
                // eslint-disable-next-line no-undefined
                request: undefined,
            };
            returnObj.request = yield Response.convertRequestToJson(response.request());
            return returnObj;
        });
    }
    /**
     * Form a {@link IResponse} object from the puppeteer page
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
    static fromPage(page, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { mainResponse, bot, responses } = data;
            return new Response({
                meta: {
                    timestamp: Date.now(),
                    username: (_a = bot.username) !== null && _a !== void 0 ? _a : 'anonymous',
                },
                page: {
                    url: page.url(),
                    viewport: page.viewport(),
                    content: yield page.content(),
                    cookies: yield page.cookies(),
                    title: yield page.title(),
                },
                main: yield Response.convertResponseToJson(mainResponse),
                xhrs: responses
            });
        });
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map