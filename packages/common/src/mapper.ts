import { Page, Request, Response, SecurityDetails } from 'puppeteer'

/* eslint-disable-next-line @typescript-eslint/member-delimiter-style */
type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value> ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1] : Otherwise

/**
 * @beta
 */
export interface ISerializedPage {
  url: ReturnType<Page['url']>
  viewport: ReturnType<Page['viewport']>
  content: PromiseValue<ReturnType<Page['content']>>
  cookies: PromiseValue<ReturnType<Page['cookies']>>
  title: PromiseValue<ReturnType<Page['title']>>
}

/**
 * @beta
 */
export interface ISerializedRequest {
  headers: ReturnType<Request['headers']>
  isNavigationRequest: ReturnType<Request['isNavigationRequest']>
  method: ReturnType<Request['method']>
  postData: ReturnType<Request['postData']>
  resourceType: ReturnType<Request['resourceType']>
  url: ReturnType<Request['url']>
  redirectChain: ISerializedRequest[]
}

/**
 * @beta
 */
export interface ISerializedResponse {
  request: ISerializedRequest
  url: ReturnType<Response['url']>
  status: ReturnType<Response['status']>
  statusText: ReturnType<Response['statusText']>
  headers: ReturnType<Response['headers']>
  securityDetails: ISerializedSecurityDetails | null
  fromCache: ReturnType<Response['fromCache']>
  fromServiceWorker: ReturnType<Response['fromServiceWorker']>

  /**
   * The response body as a string or `null` if not availble, e.g.
   * when response is a redirect response
   */
  text: PromiseValue<ReturnType<Response['text']>> | null
}

/**
 * @public
 */
export interface ISerializedSecurityDetails {
  issuer: ReturnType<SecurityDetails['issuer']>
  protocol: ReturnType<SecurityDetails['protocol']>
  subjectName: ReturnType<SecurityDetails['subjectName']>
  validFrom: ReturnType<SecurityDetails['validFrom']>
  validTo: ReturnType<SecurityDetails['validTo']>
}

export const Mapper = {
  page: {
    toObject: async (page: Page): Promise<ISerializedPage> => {
      return {
        url: page.url(),
        viewport: page.viewport(),
        content: await page.content(),
        cookies: await page.cookies(),
        title: await page.title(),
      }
    }
  },
  request: {
    toObject: async (request: Request): Promise<ISerializedRequest> => {
      const redirectChain = request.redirectChain()
      const nonCircularRedirectChain = redirectChain.filter(redirectRequest => request !== redirectRequest)
      let serializedRedirectChain: ISerializedRequest[] = []
      if (nonCircularRedirectChain.length > 0) {
        serializedRedirectChain = await Promise.all(
          nonCircularRedirectChain.map(async (request) => await Mapper.request.toObject(request))
        )
      }
      return {
        headers: request.headers(),
        isNavigationRequest: request.isNavigationRequest(),
        method: request.method(),
        postData: request.postData(),
        resourceType: request.resourceType(),
        url: request.url(),
        redirectChain: serializedRedirectChain
      }
    }
  },
  response: {
    toObject: async (response: Response): Promise<ISerializedResponse> => {
      return {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        securityDetails: await (async () => {
          const securityDetails = response.securityDetails()
          if (securityDetails === null) {
            return null
          }
          return await Mapper.securityDetails.toObject(securityDetails)
        })(),
        fromCache: response.fromCache(),
        fromServiceWorker: response.fromServiceWorker(),
        text: await response.text().catch(() => null),
        request: await Mapper.request.toObject(response.request()),
      }
    }
  },
  securityDetails: {
    toObject: async (securityDetails: SecurityDetails): Promise<ISerializedSecurityDetails> => {
      return {
        issuer: securityDetails.issuer(),
        protocol: securityDetails.protocol(),
        subjectName: securityDetails.subjectName(),
        validFrom: securityDetails.validFrom(),
        validTo: securityDetails.validTo()
      }
    }
  }
}
