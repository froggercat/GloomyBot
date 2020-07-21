import "reflect-metadata";
import 'mocha';
import moment from 'moment';
import { WarclockFinder } from "../../../src/services/warclock-finder";
import Warclock from "../../../src/models/warclock";
import { expect } from 'chai';


describe('WarclockFinderIntegration', function () {
    let service: WarclockFinder;
    let server: string;

    before(() => {
        service = new WarclockFinder(process.env.DATABASE_URL, process.env.GOOGLE_APPLICATION_CREDENTIALS);
        server = "integration_test"
    })

    it('should save wc data to the db', function () {
        let wc = new Warclock(moment.utc(), this.test.title);
        let ref = service.saveWC(wc, server);
        expect(!!ref).to.be.true;
    })

    it('should have data now ....', async () => {
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.contain(server);
        expect(!!result).to.be.true;
    })

    it('should save wc data to another server', async function () {
        let wc = new Warclock(moment.utc(), this.test.title);
        let another_server = "not_integration_test"
        let ref = service.saveWC(wc, another_server);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.contain(another_server);
    })

    it('should delete single record', async function() {
        let wc = new Warclock(moment.utc(), this.test.title);
        let ref = service.saveWC(wc, server);
        let data = (await service.retrieveDB())[server];
        let thisKey = Object.entries(data).filter(entry => {
            let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description
            return result
        })[0][0];
        data = {[thisKey]: data[thisKey]};
        ref = service.clearData(data, server);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(Object.keys(result[server])).to.not.contain(thisKey);
        expect(!!result).to.be.true;
    })

    it('should delete multiple records', async function() {
        let wcs = [
            new Warclock(moment.utc(), this.test.title + "#1"),
            new Warclock(moment.utc(), this.test.title + "#2"),
        ];
        wcs.forEach(wc => service.saveWC(wc, server));
        let data = (await service.retrieveDB())[server];
        // console.log(data, wcs.map(w => w.time), wcs.map(w => w.description));
        let theseKeys = Object.entries(data).filter(entry => {
            let result = wcs.map(w => w.time).includes(entry[1]['time']) && 
                wcs.map(w => w.description).includes(entry[1]['description'])
            return result
        }).map(v => v[0]);
        // console.log(theseKeys);
        data = theseKeys.map(thisKey => {
            return {[thisKey]: data[thisKey]}
        });
        // console.log(data);
        let ref = service.clearData(data, server);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(Object.keys(result[server])).to.not.include(theseKeys);
        expect(!!result).to.be.true;
    })

    it('should delete single server', async () => {
        let ref = service.clearData(null, server);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.not.contain(server);
        expect(!!result).to.be.true;
    })

    it('should delete whole nodes', async () => {
        let ref = service.clearData(null, null);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(!!result).to.be.false;
    })
})