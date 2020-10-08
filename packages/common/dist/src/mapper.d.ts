import { Page, Request, Response, SecurityDetails } from 'puppeteer';
declare type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value> ? {
    0: PromiseValue<Value>;
    1: Value;
}[PromiseType extends Promise<unknown> ? 0 : 1] : Otherwise;
/**
 * @beta
 */
export interface ISerializedPage {
    url: ReturnType<Page['url']>;
    viewport: ReturnType<Page['viewport']>;
    content: PromiseValue<ReturnType<Page['content']>>;
    cookies: PromiseValue<ReturnType<Page['cookies']>>;
    title: PromiseValue<ReturnType<Page['title']>>;
}
/**
 * @beta
 */
export interface ISerializedRequest {
    headers: ReturnType<Request['headers']>;
    isNavigationRequest: ReturnType<Request['isNavigationRequest']>;
    method: ReturnType<Request['method']>;
    postData: ReturnType<Request['postData']>;
    resourceType: ReturnType<Request['resourceType']>;
    url: ReturnType<Request['url']>;
    redirectChain: ISerializedRequest[];
}
/**
 * @beta
 */
export interface ISerializedResponse {
    request: ISerializedRequest;
    url: ReturnType<Response['url']>;
    status: ReturnType<Response['status']>;
    statusText: ReturnType<Response['statusText']>;
    headers: ReturnType<Response['headers']>;
    securityDetails: ISerializedSecurityDetails | null;
    fromCache: ReturnType<Response['fromCache']>;
    fromServiceWorker: ReturnType<Response['fromServiceWorker']>;
    /**
     * The response body as a string or `null` if not availble, e.g.
     * when response is a redirect response
     */
    text: PromiseValue<ReturnType<Response['text']>> | null;
}
/**
 * @public
 */
export interface ISerializedSecurityDetails {
    issuer: ReturnType<SecurityDetails['issuer']>;
    protocol: ReturnType<SecurityDetails['protocol']>;
    subjectName: ReturnType<SecurityDetails['subjectName']>;
    validFrom: ReturnType<SecurityDetails['validFrom']>;
    validTo: ReturnType<SecurityDetails['validTo']>;
}
export declare const Mapper: {
    page: {
        toObject: (page: Page) => Promise<ISerializedPage>;
    };
    request: {
        toObject: (request: Request) => Promise<ISerializedRequest>;
    };
    response: {
        toObject: (response: Response) => Promise<ISerializedResponse>;
    };
    securityDetails: {
        toObject: (securityDetails: SecurityDetails) => Promise<ISerializedSecurityDetails>;
    };
};
export {};
//# sourceMappingURL=mapper.d.ts.map