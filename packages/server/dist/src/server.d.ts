/// <reference types="node" />
import * as common from '@authless/common';
import * as core from '@authless/core';
import * as http from 'http';
import { PuppeteerExtraPlugin } from 'puppeteer-extra';
export interface IServerConfig {
    domainPathRouter: core.DomainPathRouter;
    botRouter: core.BotRouter;
    puppeteerParams: common.PuppeteerParams;
    puppeteerPlugins?: PuppeteerExtraPlugin[];
    proxy?: common.ProxyConfig;
}
/**
 * Helper class to start your running Authless server
 *
 * @remarks
 * This class can be used to create a configurable puppeteer instance with
 * some built-in functionality and plugins
 *
 * @example
 * ```ts
 * await browser = Server.launchBrowser(myDomainPath, myBot, {puppeteerParams, puppeteerPlugins, ..})
 * await page = browser.newPage()
 *
 * await domainPath.pageHandler(page, ..)
 * ```
 *
 * @beta
 */
export declare class Server {
    domainPathRouter: core.DomainPathRouter;
    botRouter: core.BotRouter;
    puppeteerParams?: common.PuppeteerParams;
    puppeteerPlugins?: PuppeteerExtraPlugin[];
    proxy?: common.ProxyConfig;
    /**
     * Create a Authless server instance
     *
     * @beta
     */
    constructor(config: IServerConfig);
    private static ping;
    private static speedtest;
    private scrape;
    run(): Promise<http.Server>;
}
//# sourceMappingURL=server.d.ts.map