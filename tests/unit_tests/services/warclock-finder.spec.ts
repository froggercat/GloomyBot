import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { WCFinder } from "../../../src/services/warclock-finder";

describe('WarclockFinder', () => {
    let service: WCFinder;
    beforeEach(() => {
        service = new WCFinder();
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
});