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
const warclock_database_1 = require("../../../src/data_access/warclock-database");
const warclock_1 = __importDefault(require("../../../src/models/warclock"));
const chai_1 = require("chai");
const firebase_connection_1 = require("../../../src/data_access/firebase-connection");
describe('WarclockDatabase', function () {
    let service;
    let connection = new firebase_connection_1.FirebaseConnection(process.env.DATABASE_URL, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    before(() => {
        service = new warclock_database_1.WarclockDatabase(connection);
    });
    beforeEach(() => {
        service.guild = "integration_test";
    });
    it('should save wc data to the db', function () {
        let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
        let ref = service.saveWC(wc);
        chai_1.expect(!!ref).to.be.true;
    });
    it('should have data now ....', () => __awaiter(this, void 0, void 0, function* () {
        let old_guild = service.guild;
        service.guild = "";
        let result = yield service.retrieveDB();
        chai_1.expect(Object.keys(result)).to.contain(old_guild);
        chai_1.expect(!!result).to.be.true;
    }));
    it('should save wc data to another server', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
            service.guild = "not_integration_test";
            let ref = service.saveWC(wc);
            chai_1.expect(!!ref).to.be.true;
            let old_guild = service.guild;
            service.guild = "";
            let result = yield service.retrieveDB();
            chai_1.expect(Object.keys(result)).to.contain(old_guild);
        });
    });
    it('should retrive all wc data for a server', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
            let ref = service.saveWC(wc);
            chai_1.expect(!!ref).to.be.true;
            let result = yield service.retrieveDB();
            let thisKey = Object.entries(result).filter(entry => {
                let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description;
                return result;
            })[0][0];
            chai_1.expect(thisKey).to.not.be.null;
            chai_1.expect(thisKey).to.not.be.undefined;
            chai_1.expect(thisKey).to.not.be.empty;
        });
    });
    it('should edit a single record', () => __awaiter(this, void 0, void 0, function* () {
        let original_description = "i'm gonna edit this";
        let wc = new warclock_1.default(moment_1.default.utc(), original_description);
        let ref = service.saveWC(wc);
        chai_1.expect(!!ref).to.be.true;
        let result = yield service.retrieveDB();
        let thisKey = Object.entries(result).filter(entry => {
            let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description;
            return result;
        })[0][0];
        let new_description = "this is another description";
        wc = new warclock_1.default(wc.time, new_description);
        ref = service.saveWC(wc, thisKey);
        result = yield service.retrieveDB();
        chai_1.expect(result[thisKey].description).to.equal(new_description);
    }));
    it('should delete single record', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wc = new warclock_1.default(moment_1.default.utc(), this.test.title);
            let ref = service.saveWC(wc);
            let data = yield service.retrieveDB();
            let temp = Object.entries(data).filter(entry => {
                let result = entry[1]['time'] == wc.time && entry[1]['description'] == wc.description;
                return result;
            });
            let thisKey = temp[0][0];
            ref = service.clearData([thisKey]);
            chai_1.expect(!!ref).to.be.true;
            let result = yield service.retrieveDB();
            chai_1.expect(Object.keys(result)).to.not.contain(thisKey);
            chai_1.expect(!!result).to.be.true;
        });
    });
    it('should delete multiple records', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let wcs = [
                new warclock_1.default(moment_1.default.utc(), this.test.title + "#1"),
                new warclock_1.default(moment_1.default.utc(), this.test.title + "#2"),
            ];
            wcs.forEach(wc => service.saveWC(wc));
            let data = (yield service.retrieveDB());
            let theseKeys = Object.entries(data).filter(entry => {
                let result = wcs.map(w => w.time).includes(entry[1]['time']) &&
                    wcs.map(w => w.description).includes(entry[1]['description']);
                return result;
            }).map(v => v[0]);
            let ref = service.clearData(theseKeys);
            chai_1.expect(!!ref).to.be.true;
            let result = yield service.retrieveDB();
            chai_1.expect(Object.keys(result)).to.not.include(theseKeys);
            chai_1.expect(!!result).to.be.true;
        });
    });
    it('should delete single server', () => __awaiter(this, void 0, void 0, function* () {
        let ref = service.clearData(null);
        chai_1.expect(!!ref).to.be.true;
        let old_guild = service.guild;
        service.guild = "";
        let result = yield service.retrieveDB();
        chai_1.expect(Object.keys(result)).to.not.contain(old_guild);
        chai_1.expect(!!result).to.be.true;
    }));
    it('should delete whole nodes', () => __awaiter(this, void 0, void 0, function* () {
        service.guild = "";
        let ref = service.clearData(null);
        chai_1.expect(!!ref).to.be.true;
        let result = yield service.retrieveDB();
        chai_1.expect(!!result).to.be.false;
    }));
});
//# sourceMappingURL=warclock-database.spec.js.map