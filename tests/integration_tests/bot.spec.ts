import "reflect-metadata";
import 'mocha';
import { Bot } from "../../src/bot";
import { Client } from "discord.js";
import { instance, mock, verify, when } from "ts-mockito";

describe('Bot', () => {
    let discordMock: Client;
    let discordInstance: Client;
    let bot: Bot;

    beforeEach(() => {
        discordMock = mock(Client);
        discordInstance = instance(discordMock);
    });

    xit('logs in to client when listening', async () => {
        whenLoginThenReturn(
            new Promise(resolve => resolve("")))

        await bot.listen();

        verify(discordMock.login()).once();
    });

    xit('watches for message events when listening', async () => {
        whenOnThenReturn(instance(discordMock));

        await bot.listen();

        verify(discordMock.on("message", () => null)).once();
    })

    function whenLoginThenReturn(result: Promise<string>) {
        when(discordMock.login("Non-empty string")).
            thenReturn(result);
    }

    function whenOnThenReturn(result: Client) {
        when(discordMock.on(
            "message",
            () => null
        )).thenReturn(result);
    }

});