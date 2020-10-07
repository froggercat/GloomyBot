import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { Client } from "discord.js";
import { instance, mock } from "ts-mockito";
import { MeFinder } from "../../../src/services/me-finder";

describe('MeFinder', () => {
    let mockedDiscordClass: Client;
    let discordInstance: Client;
    let service: MeFinder;
    beforeEach(() => {
        mockedDiscordClass = mock(Client);
        discordInstance = instance(mockedDiscordClass);
        service = new MeFinder(discordInstance);
    })

    it('should give flat array of sassy replies', () => {
        expect(Array.isArray(service.respondwSass(0))).to.be.true;
        expect(Array.isArray(service.respondwSass(8))).to.be.true;
        expect(Array.isArray(service.respondwSass(8)[0])).to.be.false;
    })
});