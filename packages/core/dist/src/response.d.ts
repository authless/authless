import { IResource, IResourceCollection } from './resource';
import { IResponseMeta, RequestContainer, Xhr } from './types';
import { Page as PuppeteerPage, Request as PuppeteerRequest, Response as PuppeteerResponse } from 'puppeteer';
import { Bot } from './bots/bot';
/**
 * The raw response from a service including any (xhrs) requests and responses and meta information.
 *
 * @remarks
 *
 * A {@link IResponse} can be transformed into a {@link IResourceCollection}
 * which extracts the most relevant data from an {@link IResponse}.
 *
 * Service repositories should create their own response class implementing {@link IResponse}.
 *
 * @privateRemarks
 *
 * - Serializable: TRUE
 * - Serialization Format: Avro
 *
 * @beta
 */
export interface IResponse {
    /**
     * Meta data about response. See {@link IResponse.meta}.
     */
    meta: IResponseMeta;
    /**
     * The main page response. See {@link IResponsePage}.
     */
    page: IResponsePage;
    /**
     * The page body (usually html) of the response.
     *
     * @deprecated Can be omitted as its available via {@link IResponsePage.content}
     */
    content?: string;
    /**
     * The main request & response chain. See {@link IResponseResponse}.
     */
    main: IResponseResponse;
    /**
     * Any XHR request & responses. See {@link IResponseResponse}.
     */
    xhrs: IResponseResponse[];
    /**
     * Creates a {@link IResponseResponse} from an {@link IResponse} instance.
     */
    toResources(): IResourceCollection<IResource>;
}
/**
 * see {@link IResponse}
 *
 * @beta
 */
export declare class Response implements IResponse {
    meta: IResponseMeta;
    page: IResponsePage;
    main: IResponseResponse;
    xhrs: IResponseResponse[];
    constructor(serializedResponse: any);
    /**
     * see {@link IResponse.toResources}. Needs to be implemented by services.
     */
    toResources(): IResourceCollection<IResource>;
    /**
     * Create a {@link RequestContainer} JSON structure from the puppeteer request
     *
     * @param request - The puppeteer request from which to form the {@link RequestContainer}
     * @returns
     * A {@link RequestContainer} if possible, throws on error
     */
    static convertRequestToJson(request: PuppeteerRequest): Promise<RequestContainer>;
    /**
     * Convert a puppeteer page response into a JSON object of type {@link Xhr}
     *
     * @param response - The puppeteer response from which to generate the {@link Xhr} JSON object
     * @returns
     * A JSON object with the response metadata and content {@link Xhr}
     */
    static convertResponseToJson(response: PuppeteerResponse): Promise<Xhr>;
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
    static fromPage(page: PuppeteerPage, data: {
        mainResponse: PuppeteerResponse;
        bot: Bot;
        responses: Xhr[];
    }): Promise<Response>;
}
/**
 * Sub-type of {@link IResponsePage}.
 *
 * @privateRemarks
 *
 * @beta
 */
interface IViewport {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
}
/**
 * Sub-type of {@link ICookie}.
 *
 * @privateRemarks
 *
 * @beta
 */
declare type ISameSiteSetting = 'Strict' | 'Lax';
/**
 * Sub-type of {@link IResponsePage}.
 *
 * @privateRemarks
 *
 * @beta
 */
interface ICookie {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    size: number;
    httpOnly: boolean;
    session: boolean;
    secure: boolean;
    sameSite: ISameSiteSetting;
}
/**
 * Sub-type of {@link IResponse}.
 *
 * @privateRemarks
 *
 * - Serializable: TRUE
 * - Serialization Format: Avro
 *
 * @beta
 */
export interface IResponsePage {
    url: string;
    viewport?: IViewport;
    content: string;
    cookies: ICookie[];
    title: string;
}
/**
 * Possible HTTP-Header values.
 *
 * @privateRemarks
 *
 * @beta
 */
declare type IHeaders = Record<string, string>;
/**
 * Possible HTTP-Method values.
 *
 * @privateRemarks
 *
 * @beta
 */
declare type IHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';
/**
 * Possible HTTP-Request Resource-types.
 *
 * @privateRemarks
 *
 * @beta
 */
declare type IResourceType = 'document' | 'stylesheet' | 'image' | 'media' | 'font' | 'script' | 'texttrack' | 'xhr' | 'fetch' | 'eventsource' | 'websocket' | 'manifest' | 'other';
/**
 * Sub-type of {@link IResponse}.
 *
 * @privateRemarks
 *
 * - Serializable: TRUE
 * - Serialization Format: Avro
 *
 * @beta
 */
export interface IResponseRequest {
    headers: IHeaders;
    isNavigationRequest: boolean;
    method: IHttpMethod;
    postData: any;
    resourceType: IResourceType;
    url: string;
    redirectChain: IResponseRequest[];
}
/**
 * Security-details for {@link IResponseResponse}
 *
 * @privateRemarks
 *
 * @beta
 */
interface ISecurityDetails {
    issuer: string;
    validTo: number;
    protocol: string;
    validFrom: number;
    subjectName: string;
}
/**
 * Sub-type of {@link IResponse}.
 *
 * @privateRemarks
 *
 * - Serializable: TRUE
 * - Serialization Format: Avro
 *
 * @beta
 */
export interface IResponseResponse {
    request: IResponseRequest;
    url: string;
    status: number;
    statusText: string;
    headers: IHeaders;
    securityDetails: ISecurityDetails;
    fromCache: boolean;
    fromServiceWorker: boolean;
    text: string;
}
export {};
//# sourceMappingURL=response.d.ts.map