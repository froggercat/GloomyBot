import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import WarclockRequest from "../../../src/models/warclock-request";
import moment from 'moment'

describe('WarclockRequest', () => {
    it('should report an error if a bad time is passed', () => {
        let instance = new WarclockRequest({rawtime: "Not really a date"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(instance.error).to.have.any;
    })

    it('should set the time to now if a bad time is passed', () => {
        let instance = new WarclockRequest({})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.be.closeTo(moment().unix(), 3000);
    })

    it('should have no errors when no date is passed', () => {
        let instance = new WarclockRequest({})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(instance.error).to.not.have.any;
    })

    it('should have no errors w a real date-lookin thing', () => {
        let instance = new WarclockRequest({rawtime: "2020-01-01 11:05-05"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(instance.error).to.not.have.any;
    })

    it('should not set the time to now if a date-lookin thing is passed', () => {
        let instance = new WarclockRequest({rawtime: "12 Nov 2019 11:20 +0003"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.not.be.closeTo(moment().unix(), 3000);
    })
});