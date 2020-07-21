import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { WarclockFinder } from "../../../src/services/warclock-finder";

describe('WarclockFinderIntegration', () => {
    let service: WarclockFinder;
    before(() => {
        service = new WarclockFinder(process.env.DATABASE_URL, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    })

    it('should open up a connection to the database', () => {
        service.retrieveDB();
    })

    it('should save data to the db', () => {
        service.saveWC();
    })

    it('should have data now ....', () => {
        service.retrieveDB();
    })
})