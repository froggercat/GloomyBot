import "reflect-metadata";
import 'mocha';
import moment from 'moment';
import { WarclockDatabase } from "../../../src/data_access/warclock-database";
import Warclock from "../../../src/models/warclock";
import { expect } from 'chai';
import { FirebaseConnection } from "../../../src/data_access/firebase-connection";


describe('WarclockDatabase', function () {
    let service: WarclockDatabase;
    let connection: FirebaseConnection = new FirebaseConnection(process.env.DATABASE_URL, process.env.GOOGLE_APPLICATION_CREDENTIALS)

    before(() => {
        service = new WarclockDatabase(connection);
    })

    beforeEach(() => {
        service.guild = "integration_test";
    })

    it('should save wc data to the db', function () {
        let wc = new Warclock(moment.utc(), this.test.title);
        let ref = service.saveWC(wc);
        expect(!!ref).to.be.true;
    })

    it('should have data now ....', async () => {
        let old_guild = service.guild;
        service.guild = ""
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.contain(old_guild);
        expect(!!result).to.be.true;
    })

    it('should save wc data to another server', async function () {
        let wc = new Warclock(moment.utc(), this.test.title);
        service.guild = "not_integration_test"
        let ref = service.saveWC(wc);
        expect(!!ref).to.be.true;
        let old_guild = service.guild;
        service.guild = ""
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.contain(old_guild);
    })

    it('should retrive all wc data for a server', async function () {
        let wc = new Warclock(moment.utc(), this.test.title);
        let ref = service.saveWC(wc);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        let thisKey = Object.entries(result).filter(entry => {
            let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description
            return result
        })[0][0];
        expect(thisKey).to.not.be.null;
        expect(thisKey).to.not.be.undefined;
        expect(thisKey).to.not.be.empty;
    })

    it('should edit a single record', async () => {
        let original_description = "i'm gonna edit this"
        let wc = new Warclock(moment.utc(), original_description);
        let ref = service.saveWC(wc);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        let thisKey = Object.entries(result).filter(entry => {
            let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description
            return result
        })[0][0];
        let new_description = "this is another description"
        wc = new Warclock(wc.time, new_description)
        ref = service.saveWC(wc, thisKey);
        result = await service.retrieveDB();
        expect(result[thisKey].description).to.equal(new_description);
    })

    it('should delete single record', async function () {
        let wc = new Warclock(moment.utc(), this.test.title);
        let ref = service.saveWC(wc);
        let data = await service.retrieveDB();
        let temp = Object.entries(data).filter(entry => {
            let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description
            return result
        });
        let thisKey = temp[0][0]
        ref = service.clearData([thisKey]);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.not.contain(thisKey);
        expect(!!result).to.be.true;
    })

    it('should delete multiple records', async function () {
        let wcs = [
            new Warclock(moment.utc(), this.test.title + "#1"),
            new Warclock(moment.utc(), this.test.title + "#2"),
        ];
        wcs.forEach(wc => service.saveWC(wc));
        let data = (await service.retrieveDB());
        let theseKeys = Object.entries(data).filter(entry => {
            let result = wcs.map(w => w.time).includes(entry[1]['time']) &&
                wcs.map(w => w.description).includes(entry[1]['description'])
            return result
        }).map(v => v[0]);
        let ref = service.clearData(theseKeys);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.not.include(theseKeys);
        expect(!!result).to.be.true;
    })

    it('should delete single server', async () => {
        let ref = service.clearData(null);
        expect(!!ref).to.be.true;
        let old_guild = service.guild
        service.guild = ""
        let result = await service.retrieveDB();
        expect(Object.keys(result)).to.not.contain(old_guild);
        expect(!!result).to.be.true;
    })

    it('should delete whole nodes', async () => {
        service.guild = ""
        let ref = service.clearData(null);
        expect(!!ref).to.be.true;
        let result = await service.retrieveDB();
        expect(!!result).to.be.false;
    })
})