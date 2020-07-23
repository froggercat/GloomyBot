"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const warclock_finder_1 = require("../../../src/services/warclock-finder");
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
});
//# sourceMappingURL=warclock-finder.spec.js.map