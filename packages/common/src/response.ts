import { ISerializedPage, ISerializedResponse, Mapper } from './mapper'
import { Page, Response as ResponsePuppeteer } from 'puppeteer'
import { IResource } from './resource'
import { IResourceCollection } from './resourceCollection'

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
  meta: IResponseMeta

  /**
   * The main page response. See {@link IResponsePage}.
   */
  page: ISerializedPage

  /**
   * The main request & response chain. See {@link IResponseResponse}.
   */
  main: ISerializedResponse

  /**
   * Any XHR request & responses. See {@link IResponseResponse}.
   */
  xhrs: ISerializedResponse[]

  /**
   * Creates a {@link IResponseResponse} from an {@link IResponse} instance.
   */
  toResources(): IResourceCollection<IResource>
}

/**
 * see {@link IResponse}
 *
 * @beta
 */
export class Response implements IResponse {
  meta: IResponseMeta
  page: ISerializedPage
  main: ISerializedResponse
  xhrs: ISerializedResponse[]

  constructor (serializedResponse: any) {
    this.meta = serializedResponse.meta
    this.page = serializedResponse.page
    this.main = serializedResponse.main
    this.xhrs = serializedResponse.xhrs
  }

  /**
   * see {@link IResponse.toResources}. Needs to be implemented by services.
   */
  /* eslint-disable-next-line class-methods-use-this */
  toResources (): IResourceCollection<IResource> {
    throw new Error('not implemented yet')
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
  public static async fromPage (
    bot: any,
    page: Page,
    mainResponse: ResponsePuppeteer,
    xhrResponses: ResponsePuppeteer[]
  ): Promise<Response> {
    return new Response({
      meta: {
        timestamp: Date.now(),
        username: bot.username ?? 'anonymous',
      },
      page: await Mapper.page.toObject(page),
      main: await Mapper.response.toObject(mainResponse),
      xhrs: await Promise.all(
        xhrResponses.map(async response => await Mapper.response.toObject(response))
      )
    })
  }
}

/**
 * Authless meta information about the response of a page {@link IResponse}
 * Can include the timestamp when the page was fetched
 *
 * @beta
 */
export interface IResponseMeta {
  timestamp: number
  username: string
}
