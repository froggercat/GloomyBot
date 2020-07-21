"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const warclock_finder_1 = require("../../../src/services/warclock-finder");
describe('WarclockFinderIntegration', () => {
    let service;
    before(() => {
        service = new warclock_finder_1.WarclockFinder(process.env.DATABASE_URL, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    });
    it('should open up a connection to the database', () => {
        service.retrieveDB();
    });
    it('should save data to the db', () => {
        service.saveWC();
    });
    it('should have data now ....', () => {
        service.retrieveDB();
    });
});
//# sourceMappingURL=warclock-finder.spec.js.map