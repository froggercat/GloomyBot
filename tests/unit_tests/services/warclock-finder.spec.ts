import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { WarclockFinder } from "../../../src/services/warclock-finder";
import WarclockRequest from "../../../src/models/warclock-request";
import WarclockCommand from "../../../src/models/warclock-commands";

describe('WarclockFinder', () => {
    let service: WarclockFinder;
    beforeEach(() => {
        service = new WarclockFinder();
    })

    it('should find .wc request in the string', () => {
        expect(service.isWarclockRequest(".wc")).to.be.true;
    })
    
    it('should find wc request in the string', () => {
        expect(service.isWarclockRequest("wc")).to.be.true;
    })

    it('should find !wc request in the string', () => {
        expect(service.isWarclockRequest("!wc")).to.be.true;
    })

    it('should find ?wc request in the string', () => {
        expect(service.isWarclockRequest("?wc")).to.be.true;
    })

    it('should not find request without starting with "<punctuation>wc"', () => {
        expect(service.isWarclockRequest("not a wc")).to.be.false;
    })

    it('should parse ".wc" as an empty command', () => {
        let command = service.parseWarclockRequest(".wc")
        expect(command).to.be.instanceOf(WarclockRequest);
        expect(command.commands[0]).to.equal(WarclockCommand.help);
        expect(!!command.description).to.be.false;
        expect(command.error).to.be.empty;
        expect(!!command.id).to.be.false;
        expect(!!command.pushid).to.be.false;
    })

    it('should parse ".wc list" correctly', () => {
        let command = service.parseWarclockRequest(".wc list")
        expect(command).to.be.instanceOf(WarclockRequest);
        expect(command.commands[0]).to.equal(WarclockCommand.list);
        expect(!!command.description).to.be.false;
        expect(command.error).to.be.empty;
        expect(!!command.id).to.be.false;
        expect(!!command.pushid).to.be.false;
    })

    it('should parse ".wc 1" correctly', () => {
        let command = service.parseWarclockRequest(".wc 1")
        expect(command).to.be.instanceOf(WarclockRequest);
        expect(command.commands[0]).to.equal(WarclockCommand.id);
        expect(command.id).to.equal(1);
        expect(!!command.description).to.be.false;
        expect(command.error).to.be.empty;
        expect(!!command.pushid).to.be.false;
    })

    it('should parse ".wc start my fake timer" correctly', () => {
        let command = service.parseWarclockRequest(".wc start my fake timer")
        expect(command).to.be.instanceOf(WarclockRequest);
        expect(command.commands[0]).to.equal(WarclockCommand.start);
        expect(command.description).to.equal("my fake timer");
        expect(command.error).to.be.empty;
        expect(!!command.id).to.be.false;
        expect(!!command.pushid).to.be.false;
    })

    it('should parse ".wc start help" correctly', () => {
        let command = service.parseWarclockRequest(".wc start help")
        expect(command).to.be.instanceOf(WarclockRequest);
        expect(command.commands[0]).to.equal(WarclockCommand.start);
        expect(command.commands[1]).to.equal(WarclockCommand.help);
        expect(command.description).to.equal("help");
        expect(command.error).to.be.empty;
        expect(!!command.id).to.be.false;
        expect(!!command.pushid).to.be.false;
    })

    it('should parse ".wc help" correctly', () => {
        let command = service.parseWarclockRequest(".wc help")
        expect(command).to.be.instanceOf(WarclockRequest);
        expect(command.commands[0]).to.equal(WarclockCommand.help);
        expect(command.description).to.equal("help");
        expect(command.error).to.be.empty;
        expect(!!command.id).to.be.false;
        expect(!!command.pushid).to.be.false;
    })
});