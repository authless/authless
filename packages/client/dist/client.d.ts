import { AxiosStatic } from 'axios';

export declare class Client {
    serverUri: string;
    retries: number;
    axios: AxiosStatic;
    static isValidConfig(x: any): x is Config;
    constructor(config: Config);
    url(params: UrlParams, retryCounter?: number): Promise<any>;
}

declare interface Config {
    serverUri: string;
    retries: number;
    axios?: AxiosStatic;
}

declare interface UrlParams {
    url: string;
    referer?: string;
    responseFormat?: string;
}

export { }
