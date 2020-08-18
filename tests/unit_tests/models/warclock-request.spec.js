"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const warclock_request_1 = __importDefault(require("../../../src/models/warclock-request"));
const moment_1 = __importDefault(require("moment"));
describe('WarclockRequest', () => {
    it('should report an error if a bad time is passed', () => {
        let instance = new warclock_request_1.default({ command: ["time"], cmd_2_arg: "Not really a date" });
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(instance.error).to.not.be.empty;
    });
    it('should set the time to now if a bad time is passed', () => {
        let instance = new warclock_request_1.default({});
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(moment_1.default(instance.time).unix()).to.be.closeTo(moment_1.default().unix(), 3000);
    });
    it('should have no errors when no date is passed', () => {
        let instance = new warclock_request_1.default({});
        // console.log(moment(instance.time).toString(), instance.time)
        // console.log(instance)
        chai_1.expect(instance.error).to.be.empty;
    });
    it('should have no errors w a real date-lookin thing', () => {
        let instance = new warclock_request_1.default({ command: ["time"], cmd_2_arg: "2020-01-01 11:05-05" });
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(instance.error).to.be.empty;
    });
    it('should not set the time to now if a date-lookin thing is passed', () => {
        let instance = new warclock_request_1.default({ command: ["time"], cmd_2_arg: "12 Nov 2019 11:20 +0003" });
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(moment_1.default(instance.time).unix()).to.not.be.closeTo(moment_1.default().unix(), 3000);
    });
    it('should not set the time to now if a relative date is passed', () => {
        let instance = new warclock_request_1.default({ command: ["time"], cmd_2_arg: "5 days from now" });
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(moment_1.default(instance.time).unix()).to.not.be.closeTo(moment_1.default().unix(), 3000);
    });
    it('should not set the time to now if a relative time is passed', () => {
        let instance = new warclock_request_1.default({ command: ["time"], cmd_2_arg: "5 hours from now" });
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(moment_1.default(instance.time).unix()).to.not.be.closeTo(moment_1.default().unix(), 3000);
    });
    it('should not set the time to now if an english date is passed', () => {
        let instance = new warclock_request_1.default({ command: ["time"], cmd_2_arg: "12 Sep" });
        // console.log(moment(instance.time).toString(), instance.time)
        chai_1.expect(moment_1.default(instance.time).unix()).to.not.be.closeTo(moment_1.default().unix(), 3000);
    });
});
//# sourceMappingURL=warclock-request.spec.js.map