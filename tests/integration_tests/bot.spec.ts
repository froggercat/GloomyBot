import "reflect-metadata";
import 'mocha';
import container from "../../inversify.config";
import { TYPES } from "../../src/types";
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
        container.rebind<Client>(TYPES.Client)
            .toConstantValue(discordInstance);
        bot = container.get<Bot>(TYPES.Bot);
    });

    it('just a stub, need to add tests', async () => {
        return true;
    })

});