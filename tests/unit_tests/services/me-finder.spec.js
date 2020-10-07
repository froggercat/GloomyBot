"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const discord_js_1 = require("discord.js");
const ts_mockito_1 = require("ts-mockito");
const me_finder_1 = require("../../../src/services/me-finder");
describe('MeFinder', () => {
    let mockedDiscordClass;
    let discordInstance;
    let service;
    beforeEach(() => {
        mockedDiscordClass = ts_mockito_1.mock(discord_js_1.Client);
        discordInstance = ts_mockito_1.instance(mockedDiscordClass);
        service = new me_finder_1.MeFinder(discordInstance);
    });
    it('should give flat array of sassy replies', () => {
        chai_1.expect(Array.isArray(service.respondwSass(0))).to.be.true;
        chai_1.expect(Array.isArray(service.respondwSass(8))).to.be.true;
        chai_1.expect(Array.isArray(service.respondwSass(8)[0])).to.be.false;
    });
});
//# sourceMappingURL=me-finder.spec.js.map