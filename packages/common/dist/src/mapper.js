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
exports.Mapper = void 0;
exports.Mapper = {
    page: {
        toObject: (page) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                url: page.url(),
                viewport: page.viewport(),
                content: yield page.content(),
                cookies: yield page.cookies(),
                title: yield page.title(),
            };
        })
    },
    request: {
        toObject: (request) => __awaiter(void 0, void 0, void 0, function* () {
            const redirectChain = request.redirectChain();
            const nonCircularRedirectChain = redirectChain.filter(redirectRequest => request !== redirectRequest);
            let serializedRedirectChain = [];
            if (nonCircularRedirectChain.length > 0) {
                serializedRedirectChain = yield Promise.all(nonCircularRedirectChain.map((request) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.Mapper.request.toObject(request); })));
            }
            return {
                headers: request.headers(),
                isNavigationRequest: request.isNavigationRequest(),
                method: request.method(),
                postData: request.postData(),
                resourceType: request.resourceType(),
                url: request.url(),
                redirectChain: serializedRedirectChain
            };
        })
    },
    response: {
        toObject: (response) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                url: response.url(),
                status: response.status(),
                statusText: response.statusText(),
                headers: response.headers(),
                securityDetails: yield (() => __awaiter(void 0, void 0, void 0, function* () {
                    const securityDetails = response.securityDetails();
                    if (securityDetails === null) {
                        return null;
                    }
                    return yield exports.Mapper.securityDetails.toObject(securityDetails);
                }))(),
                fromCache: response.fromCache(),
                fromServiceWorker: response.fromServiceWorker(),
                text: yield response.text().catch(() => null),
                request: yield exports.Mapper.request.toObject(response.request()),
            };
        })
    },
    securityDetails: {
        toObject: (securityDetails) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                issuer: securityDetails.issuer(),
                protocol: securityDetails.protocol(),
                subjectName: securityDetails.subjectName(),
                validFrom: securityDetails.validFrom(),
                validTo: securityDetails.validTo()
            };
        })
    }
};
//# sourceMappingURL=mapper.js.map