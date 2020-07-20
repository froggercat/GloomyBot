"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const server_finder_1 = require("../../src/services/server-finder");
describe('ServerFinder', () => {
    let service;
    beforeEach(() => {
        service = new server_finder_1.ServerFinder();
    });
    it('should find server request in the string', () => {
        chai_1.expect(service.isServerRequest("which server")).to.be.true;
        chai_1.expect(service.isServerRequest("which server u on")).to.be.true;
    });
    it('should not find request with just the word "server"', () => {
        chai_1.expect(service.isServerRequest("server")).to.be.false;
    });
});
//# sourceMappingURL=server-finder.spec.js.map