"use strict";
/**
 * A HTTP data harvesting framework for jobs that require authentication
 *
 * @remarks
 *
 * Provides the core abstractions and functionality.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainPathRouter = exports.DomainPath = exports.BotRouter = exports.Bot = exports.AnonBot = void 0;
var anonBot_1 = require("./bots/anonBot");
Object.defineProperty(exports, "AnonBot", { enumerable: true, get: function () { return anonBot_1.AnonBot; } });
var bot_1 = require("./bots/bot");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return bot_1.Bot; } });
var botRouter_1 = require("./bots/botRouter");
Object.defineProperty(exports, "BotRouter", { enumerable: true, get: function () { return botRouter_1.BotRouter; } });
var domainPath_1 = require("./domainPaths/domainPath");
Object.defineProperty(exports, "DomainPath", { enumerable: true, get: function () { return domainPath_1.DomainPath; } });
var domainPathRouter_1 = require("./domainPaths/domainPathRouter");
Object.defineProperty(exports, "DomainPathRouter", { enumerable: true, get: function () { return domainPathRouter_1.DomainPathRouter; } });
//# sourceMappingURL=index.js.map