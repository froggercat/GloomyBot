import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { PingFinder } from "../../../src/services/ping-finder";
import { ServerFinder } from "../../../src/services/server-finder";
import { MessageResponder } from "../../../src/services/message-responder";
import { instance, mock, verify, when } from "ts-mockito";
import { Message } from "discord.js";
import { WarclockFinder } from "../../../src/services/warclock-finder";
import { WarclockResponder } from "../../../src/services/warclock-responder";
import { MeFinder } from "../../../src/services/me-finder";

describe('MessageResponder', () => {
    let mockedPingFinderClass: PingFinder;
    let mockedPingFinderInstance: PingFinder;
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let mockedServerFinderClass: ServerFinder;
    let mockedServerFinderInstance: ServerFinder;
    let mockedWarclockFinderClass: WarclockFinder;
    let mockedWarclockFinderInstance: WarclockFinder;
    let mockedWarclockResponderClass: WarclockResponder;
    let mockedWarclockResponderInstance: WarclockResponder;
    let mockedMeFinderClass: MeFinder;
    let mockedMeFinderInstance: MeFinder;

    let service: MessageResponder;

    beforeEach(() => {
        mockedPingFinderClass = mock(PingFinder);
        mockedPingFinderInstance = instance(mockedPingFinderClass);
        mockedMessageClass = mock(Message);
        mockedMessageInstance = instance(mockedMessageClass);
        mockedServerFinderClass = mock(ServerFinder);
        mockedServerFinderInstance = instance(mockedServerFinderClass);
        mockedWarclockFinderClass = mock(WarclockFinder);
        mockedWarclockFinderInstance = instance(mockedWarclockFinderClass);
        mockedWarclockResponderClass = mock(WarclockResponder);
        mockedWarclockResponderInstance = instance(mockedWarclockResponderClass);
        mockedMeFinderClass = mock(MeFinder);
        mockedMeFinderInstance = instance(mockedMeFinderClass);
        setMessageContents();

        service = new MessageResponder(mockedPingFinderInstance, mockedServerFinderInstance, mockedWarclockFinderInstance, mockedWarclockResponderInstance, mockedMeFinderInstance);
    })

    it('should reply with pong', async () => {
        whenIsPingThenReturn(true);

        await service.handle(mockedMessageInstance);

        verify(mockedMessageClass.reply('pong!')).once();
    })

    it('should reply with server info', async () => {

        whenIsServerThenReturn(true);

        await service.handle(mockedMessageInstance);

        verify(mockedMessageClass.reply(process.env.SERVER)).once();
    })

    it('should not reply', async () => {
        whenIsPingThenReturn(false);

        await service.handle(mockedMessageInstance).then(() => {
            // Successful promise is unexpected, so we fail the test
            expect.fail('Unexpected promise');
        }).catch(() => {
            // Rejected promise is expected, so nothing happens here
        });

        verify(mockedMessageClass.reply('pong!')).never();

        whenIsServerThenReturn(false);

        await service.handle(mockedMessageInstance).then(() => {
            // Successful promise is unexpected, so we fail the test
            expect.fail('Unexpected promise');
        }).catch(() => {
            // Rejected promise is expected, so nothing happens here
        });

        verify(mockedMessageClass.reply(process.env.SERVER)).never();
    })

    function setMessageContents() {
        mockedMessageInstance.content = "Non-empty string";
    }

    function whenIsPingThenReturn(result: boolean) {
        when(mockedPingFinderClass.isPing("Non-empty string")).thenReturn(result);
    }

    function whenIsServerThenReturn(result: boolean) {
        when(mockedServerFinderClass.isServerRequest("Non-empty string")).thenReturn(result);
    }
});