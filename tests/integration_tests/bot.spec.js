"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const inversify_config_1 = require("../../inversify.config");
const types_1 = require("../../src/types");
const discord_js_1 = require("discord.js");
const ts_mockito_1 = require("ts-mockito");
describe('Bot', () => {
    let discordMock;
    let discordInstance;
    let bot;
    beforeEach(() => {
        discordMock = ts_mockito_1.mock(discord_js_1.Client);
        discordInstance = ts_mockito_1.instance(discordMock);
        inversify_config_1.default.rebind(types_1.TYPES.Client)
            .toConstantValue(discordInstance);
        bot = inversify_config_1.default.get(types_1.TYPES.Bot);
    });
    it('just a stub, need to add tests', () => __awaiter(void 0, void 0, void 0, function* () {
        return true;
    }));
});
//# sourceMappingURL=bot.spec.js.map