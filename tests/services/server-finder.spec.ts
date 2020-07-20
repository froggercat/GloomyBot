import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { ServerFinder } from "../../src/services/server-finder";

describe('ServerFinder', () => {
    let service: ServerFinder;
    beforeEach(() => {
        service = new ServerFinder();
    })

    it('should find server request in the string', () => {
        expect(service.isServerRequest("which server")).to.be.true;
        expect(service.isServerRequest("which server u on")).to.be.true;
    })

    it('should not find request with just the word "server"', () => {
        expect(service.isServerRequest("server")).to.be.false;
    })
});