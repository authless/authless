import { AxiosStatic } from 'axios';
interface Config {
    serverUri: string;
    retries: number;
    axios?: AxiosStatic;
}
interface UrlParams {
    url: string;
    referer?: string;
    responseFormat?: string;
}
declare class Client {
    serverUri: string;
    retries: number;
    axios: AxiosStatic;
    static isValidConfig(x: any): x is Config;
    constructor(config: Config);
    url(params: UrlParams, retryCounter?: number): Promise<any>;
}
export { Client };
//# sourceMappingURL=client.d.ts.map