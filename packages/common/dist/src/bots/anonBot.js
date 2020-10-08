"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnonBot = void 0;
const bot_1 = require("./bot");
/**
 * The "Anonymous Bot", i.e. a bot that has no credentials.
 *
 * @alpha
 */
class AnonBot extends bot_1.Bot {
    constructor(config = { urls: [] }) {
        // eslint-disable-next-line no-undefined
        super(Object.assign(Object.assign({}, config), { urls: [], credentials: undefined }));
        this.type = 'anonymous';
    }
}
exports.AnonBot = AnonBot;
//# sourceMappingURL=anonBot.js.map