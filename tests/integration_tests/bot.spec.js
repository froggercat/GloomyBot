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
const discord_js_1 = require("discord.js");
const ts_mockito_1 = require("ts-mockito");
describe('Bot', () => {
    let discordMock;
    let discordInstance;
    let bot;
    beforeEach(() => {
        discordMock = ts_mockito_1.mock(discord_js_1.Client);
        discordInstance = ts_mockito_1.instance(discordMock);
    });
    xit('logs in to client when listening', () => __awaiter(void 0, void 0, void 0, function* () {
        whenLoginThenReturn(new Promise(resolve => resolve("")));
        yield bot.listen();
        ts_mockito_1.verify(discordMock.login()).once();
    }));
    xit('watches for message events when listening', () => __awaiter(void 0, void 0, void 0, function* () {
        whenOnThenReturn(ts_mockito_1.instance(discordMock));
        yield bot.listen();
        ts_mockito_1.verify(discordMock.on("message", () => null)).once();
    }));
    function whenLoginThenReturn(result) {
        ts_mockito_1.when(discordMock.login("Non-empty string")).
            thenReturn(result);
    }
    function whenOnThenReturn(result) {
        ts_mockito_1.when(discordMock.on("message", () => null)).thenReturn(result);
    }
});
//# sourceMappingURL=bot.spec.js.map