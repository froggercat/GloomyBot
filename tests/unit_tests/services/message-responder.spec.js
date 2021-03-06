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
const chai_1 = require("chai");
const ping_finder_1 = require("../../../src/services/ping-finder");
const server_finder_1 = require("../../../src/services/server-finder");
const message_responder_1 = require("../../../src/services/message-responder");
const ts_mockito_1 = require("ts-mockito");
const discord_js_1 = require("discord.js");
const warclock_finder_1 = require("../../../src/services/warclock-finder");
const warclock_responder_1 = require("../../../src/services/warclock-responder");
const me_finder_1 = require("../../../src/services/me-finder");
describe('MessageResponder', () => {
    let mockedPingFinderClass;
    let mockedPingFinderInstance;
    let mockedMessageClass;
    let mockedMessageInstance;
    let mockedServerFinderClass;
    let mockedServerFinderInstance;
    let mockedWarclockFinderClass;
    let mockedWarclockFinderInstance;
    let mockedWarclockResponderClass;
    let mockedWarclockResponderInstance;
    let mockedMeFinderClass;
    let mockedMeFinderInstance;
    let service;
    beforeEach(() => {
        mockedPingFinderClass = ts_mockito_1.mock(ping_finder_1.PingFinder);
        mockedPingFinderInstance = ts_mockito_1.instance(mockedPingFinderClass);
        mockedMessageClass = ts_mockito_1.mock(discord_js_1.Message);
        mockedMessageInstance = ts_mockito_1.instance(mockedMessageClass);
        mockedServerFinderClass = ts_mockito_1.mock(server_finder_1.ServerFinder);
        mockedServerFinderInstance = ts_mockito_1.instance(mockedServerFinderClass);
        mockedWarclockFinderClass = ts_mockito_1.mock(warclock_finder_1.WarclockFinder);
        mockedWarclockFinderInstance = ts_mockito_1.instance(mockedWarclockFinderClass);
        mockedWarclockResponderClass = ts_mockito_1.mock(warclock_responder_1.WarclockResponder);
        mockedWarclockResponderInstance = ts_mockito_1.instance(mockedWarclockResponderClass);
        mockedMeFinderClass = ts_mockito_1.mock(me_finder_1.MeFinder);
        mockedMeFinderInstance = ts_mockito_1.instance(mockedMeFinderClass);
        setMessageContents();
        service = new message_responder_1.MessageResponder(mockedPingFinderInstance, mockedServerFinderInstance, mockedWarclockFinderInstance, mockedWarclockResponderInstance, mockedMeFinderInstance);
    });
    it('should reply with pong', () => __awaiter(void 0, void 0, void 0, function* () {
        whenIsPingThenReturn(true);
        yield service.handle(mockedMessageInstance);
        ts_mockito_1.verify(mockedMessageClass.reply('pong!')).once();
    }));
    it('should reply with server info', () => __awaiter(void 0, void 0, void 0, function* () {
        whenIsServerThenReturn(true);
        yield service.handle(mockedMessageInstance);
        ts_mockito_1.verify(mockedMessageClass.reply(process.env.SERVER)).once();
    }));
    it('should not reply', () => __awaiter(void 0, void 0, void 0, function* () {
        whenIsPingThenReturn(false);
        yield service.handle(mockedMessageInstance).then(() => {
            // Successful promise is unexpected, so we fail the test
            chai_1.expect.fail('Unexpected promise');
        }).catch(() => {
            // Rejected promise is expected, so nothing happens here
        });
        ts_mockito_1.verify(mockedMessageClass.reply('pong!')).never();
        whenIsServerThenReturn(false);
        yield service.handle(mockedMessageInstance).then(() => {
            // Successful promise is unexpected, so we fail the test
            chai_1.expect.fail('Unexpected promise');
        }).catch(() => {
            // Rejected promise is expected, so nothing happens here
        });
        ts_mockito_1.verify(mockedMessageClass.reply(process.env.SERVER)).never();
    }));
    function setMessageContents() {
        mockedMessageInstance.content = "Non-empty string";
    }
    function whenIsPingThenReturn(result) {
        ts_mockito_1.when(mockedPingFinderClass.isPing("Non-empty string")).thenReturn(result);
    }
    function whenIsServerThenReturn(result) {
        ts_mockito_1.when(mockedServerFinderClass.isServerRequest("Non-empty string")).thenReturn(result);
    }
});
//# sourceMappingURL=message-responder.spec.js.map