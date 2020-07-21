"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./src/types");
const bot_1 = require("./src/bot");
const discord_js_1 = require("discord.js");
const message_responder_1 = require("./src/services/message-responder");
const ping_finder_1 = require("./src/services/ping-finder");
const server_finder_1 = require("./src/services/server-finder");
const warclock_finder_1 = require("./src/services/warclock-finder");
let container = new inversify_1.Container();
container.bind(types_1.TYPES.Bot).to(bot_1.Bot).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client());
container.bind(types_1.TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind(types_1.TYPES.MessageResponder).to(message_responder_1.MessageResponder).inSingletonScope();
container.bind(types_1.TYPES.PingFinder).to(ping_finder_1.PingFinder).inSingletonScope();
container.bind(types_1.TYPES.ServerFinder).to(server_finder_1.ServerFinder).inSingletonScope();
container.bind(types_1.TYPES.WarclockFinder).to(warclock_finder_1.WarclockFinder).inSingletonScope();
container.bind(types_1.TYPES.GoogleAppCred).toConstantValue(process.env.GOOGLE_APPLICATION_CREDENTIALS);
container.bind(types_1.TYPES.DatabaseURL).toConstantValue(process.env.DATABASE_URL);
exports.default = container;
//# sourceMappingURL=inversify.config.js.map