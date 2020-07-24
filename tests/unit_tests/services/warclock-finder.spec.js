"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const warclock_finder_1 = require("../../../src/services/warclock-finder");
const warclock_request_1 = __importDefault(require("../../../src/models/warclock-request"));
const warclock_commands_1 = __importDefault(require("../../../src/models/warclock-commands"));
describe('WarclockFinder', () => {
    let service;
    beforeEach(() => {
        service = new warclock_finder_1.WarclockFinder();
    });
    it('should find .wc request in the string', () => {
        chai_1.expect(service.isWarclockRequest(".wc")).to.be.true;
    });
    it('should find wc request in the string', () => {
        chai_1.expect(service.isWarclockRequest("wc")).to.be.true;
    });
    it('should find !wc request in the string', () => {
        chai_1.expect(service.isWarclockRequest("!wc")).to.be.true;
    });
    it('should find ?wc request in the string', () => {
        chai_1.expect(service.isWarclockRequest("?wc")).to.be.true;
    });
    it('should not find request without starting with "<punctuation>wc"', () => {
        chai_1.expect(service.isWarclockRequest("not a wc")).to.be.false;
    });
    it('should parse ".wc" as an empty command', () => {
        let command = service.parseWarclockRequest(".wc");
        chai_1.expect(command).to.be.instanceOf(warclock_request_1.default);
        chai_1.expect(command.commands[0]).to.equal(warclock_commands_1.default.help);
        chai_1.expect(!!command.description).to.be.false;
        chai_1.expect(command.error).to.be.empty;
        chai_1.expect(!!command.id).to.be.false;
        chai_1.expect(!!command.pushid).to.be.false;
    });
    it('should parse ".wc list" correctly', () => {
        let command = service.parseWarclockRequest(".wc list");
        chai_1.expect(command).to.be.instanceOf(warclock_request_1.default);
        chai_1.expect(command.commands[0]).to.equal(warclock_commands_1.default.list);
        chai_1.expect(!!command.description).to.be.false;
        chai_1.expect(command.error).to.be.empty;
        chai_1.expect(!!command.id).to.be.false;
        chai_1.expect(!!command.pushid).to.be.false;
    });
    it('should parse ".wc 1" correctly', () => {
        let command = service.parseWarclockRequest(".wc 1");
        chai_1.expect(command).to.be.instanceOf(warclock_request_1.default);
        chai_1.expect(command.commands[0]).to.equal(warclock_commands_1.default.id);
        chai_1.expect(command.id).to.equal(1);
        chai_1.expect(!!command.description).to.be.false;
        chai_1.expect(command.error).to.be.empty;
        chai_1.expect(!!command.pushid).to.be.false;
    });
    it('should parse ".wc start my fake timer" correctly', () => {
        let command = service.parseWarclockRequest(".wc start my fake timer");
        chai_1.expect(command).to.be.instanceOf(warclock_request_1.default);
        chai_1.expect(command.commands[0]).to.equal(warclock_commands_1.default.start);
        chai_1.expect(command.description).to.equal("my fake timer");
        chai_1.expect(command.error).to.be.empty;
        chai_1.expect(!!command.id).to.be.false;
        chai_1.expect(!!command.pushid).to.be.false;
    });
    it('should parse ".wc start help" correctly', () => {
        let command = service.parseWarclockRequest(".wc start help");
        chai_1.expect(command).to.be.instanceOf(warclock_request_1.default);
        chai_1.expect(command.commands[0]).to.equal(warclock_commands_1.default.start);
        chai_1.expect(command.commands[1]).to.equal(warclock_commands_1.default.help);
        chai_1.expect(command.description).to.equal("help");
        chai_1.expect(command.error).to.be.empty;
        chai_1.expect(!!command.id).to.be.false;
        chai_1.expect(!!command.pushid).to.be.false;
    });
    it('should parse ".wc help" correctly', () => {
        let command = service.parseWarclockRequest(".wc help");
        chai_1.expect(command).to.be.instanceOf(warclock_request_1.default);
        chai_1.expect(command.commands[0]).to.equal(warclock_commands_1.default.help);
        chai_1.expect(command.description).to.equal("help");
        chai_1.expect(command.error).to.be.empty;
        chai_1.expect(!!command.id).to.be.false;
        chai_1.expect(!!command.pushid).to.be.false;
    });
});
//# sourceMappingURL=warclock-finder.spec.js.map