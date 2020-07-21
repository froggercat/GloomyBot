"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const moment_1 = __importDefault(require("moment"));
const warclock_finder_1 = require("../../../src/services/warclock-finder");
const warclock_1 = __importDefault(require("../../../src/models/warclock"));
const chai_1 = require("chai");
describe('WarclockFinderIntegration', function () {
    let service;
    let server;
    before(() => {
        service = new warclock_finder_1.WarclockFinder(process.env.DATABASE_URL, process.env.GOOGLE_APPLICATION_CREDENTIALS);
        server = "integration_test";
    });
    it('should save wc data to the db', function () {
        let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
        let ref = service.saveWC(wc, server);
        chai_1.expect(!!ref).to.be.true;
    });
    it('should have data now ....', () => __awaiter(this, void 0, void 0, function* () {
        let result = yield service.retrieveDB();
        chai_1.expect(Object.keys(result)).to.contain(server);
        chai_1.expect(!!result).to.be.true;
    }));
    it('should save wc data to another server', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
            let another_server = "not_integration_test";
            let ref = service.saveWC(wc, another_server);
            chai_1.expect(!!ref).to.be.true;
            let result = yield service.retrieveDB();
            chai_1.expect(Object.keys(result)).to.contain(another_server);
        });
    });
    it('should delete single record', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
            let ref = service.saveWC(wc, server);
            let data = (yield service.retrieveDB())[server];
            let thisKey = Object.entries(data).filter(entry => {
                let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description;
                return result;
            })[0][0];
            data = { [thisKey]: data[thisKey] };
            ref = service.clearData(data, server);
            chai_1.expect(!!ref).to.be.true;
            let result = yield service.retrieveDB();
            chai_1.expect(Object.keys(result[server])).to.not.contain(thisKey);
            chai_1.expect(!!result).to.be.true;
        });
    });
    it('should delete multiple records', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wcs = [
                new warclock_1.default(moment_1.default.utc(), this.test.title + "#1"),
                new warclock_1.default(moment_1.default.utc(), this.test.title + "#2"),
            ];
            wcs.forEach(wc => service.saveWC(wc, server));
            let data = (yield service.retrieveDB())[server];
            // console.log(data, wcs.map(w => w.time), wcs.map(w => w.description));
            let theseKeys = Object.entries(data).filter(entry => {
                let result = wcs.map(w => w.time).includes(entry[1]['time']) &&
                    wcs.map(w => w.description).includes(entry[1]['description']);
                return result;
            }).map(v => v[0]);
            // console.log(theseKeys);
            data = theseKeys.map(thisKey => {
                return { [thisKey]: data[thisKey] };
            });
            // console.log(data);
            let ref = service.clearData(data, server);
            chai_1.expect(!!ref).to.be.true;
            let result = yield service.retrieveDB();
            chai_1.expect(Object.keys(result[server])).to.not.include(theseKeys);
            chai_1.expect(!!result).to.be.true;
        });
    });
    it('should delete single server', () => __awaiter(this, void 0, void 0, function* () {
        let ref = service.clearData(null, server);
        chai_1.expect(!!ref).to.be.true;
        let result = yield service.retrieveDB();
        chai_1.expect(Object.keys(result)).to.not.contain(server);
        chai_1.expect(!!result).to.be.true;
    }));
    it('should delete whole nodes', () => __awaiter(this, void 0, void 0, function* () {
        let ref = service.clearData(null, null);
        chai_1.expect(!!ref).to.be.true;
        let result = yield service.retrieveDB();
        chai_1.expect(!!result).to.be.false;
    }));
});
//# sourceMappingURL=warclock-finder.spec.js.map