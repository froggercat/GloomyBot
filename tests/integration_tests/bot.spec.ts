import "reflect-metadata";
import 'mocha';
import { Bot } from "../../src/bot";
import { Client, Message } from "discord.js";
import { instance, mock, verify, when } from "ts-mockito";
import { MessageResponder } from "../../src/services/message-responder";

describe('Bot', () => {
    let mockedDiscordClass: Client;
    let discordInstance: Client;
    let token: string = "fake_token";
    let mockedMessageResponderClass: MessageResponder;
    let messageResponderInstance: MessageResponder;
    let bot: Bot;

    before(() => {
        mockedDiscordClass = mock(Client);
        discordInstance = instance(mockedDiscordClass);
        mockedMessageResponderClass = mock(MessageResponder);
        messageResponderInstance = instance(mockedMessageResponderClass);
        bot = new Bot(discordInstance, token, messageResponderInstance);
    });

    it('logs in to client when listening', async () => {
        whenLoginThenReturn(token);

        await bot.listen()

        verify(mockedDiscordClass.login(token)).once();
    });

    function whenLoginThenReturn(result: string) {
        when(mockedDiscordClass.login(token))
            .thenReturn(new Promise<string>(resolve => resolve(result)));
    }
});