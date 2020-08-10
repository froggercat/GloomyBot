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
const bot_1 = require("../../src/bot");
const discord_js_1 = require("discord.js");
const ts_mockito_1 = require("ts-mockito");
const message_responder_1 = require("../../src/services/message-responder");
describe('Bot', () => {
    let mockedDiscordClass;
    let discordInstance;
    let token = "fake_token";
    let mockedMessageResponderClass;
    let messageResponderInstance;
    let bot;
    before(() => {
        mockedDiscordClass = ts_mockito_1.mock(discord_js_1.Client);
        discordInstance = ts_mockito_1.instance(mockedDiscordClass);
        mockedMessageResponderClass = ts_mockito_1.mock(message_responder_1.MessageResponder);
        messageResponderInstance = ts_mockito_1.instance(mockedMessageResponderClass);
        bot = new bot_1.Bot(discordInstance, token, messageResponderInstance);
    });
    it('logs in to client when listening', () => __awaiter(void 0, void 0, void 0, function* () {
        whenLoginThenReturn(token);
        yield bot.listen();
        ts_mockito_1.verify(mockedDiscordClass.login(token)).once();
    }));
    function whenLoginThenReturn(result) {
        ts_mockito_1.when(mockedDiscordClass.login(token))
            .thenReturn(new Promise(resolve => resolve(result)));
    }
});
//# sourceMappingURL=bot.spec.js.map