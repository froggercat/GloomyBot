import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import WarclockRequest from "../../../src/models/warclock-request";
import moment from 'moment'
import WarclockCommand from "../../../src/models/warclock-commands";

export type WarclockCommandKey = keyof typeof WarclockCommand;

export const WARCLOCK_COMMAND_KEYS = new Map<WarclockCommand, WarclockCommandKey>(
    Object.entries(WarclockCommand).map(([key, value]:[WarclockCommandKey, WarclockCommand]) => [value, key])
)

describe('WarclockRequest', () => {
    it('should report an error if a bad time is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)], cmd_arg: "Not really a date"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(instance.error).to.not.be.empty;
    })

    it('should set the time to now if a bad time is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)]})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.be.closeTo(moment().unix(), 3000);
    })

    it('should have no errors when no date is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)]})
        // console.log(moment(instance.time).toString(), instance.time)
        // console.log(instance)
        expect(instance.error).to.be.empty;
    })

    it('should have no errors w a real date-lookin thing', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)], cmd_arg: "2020-01-01 11:05-05"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(instance.error).to.be.empty;
    })

    it('should not set the time to now if a date-lookin thing is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)], cmd_arg: "12 Nov 2019 11:20 +0003"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.not.be.closeTo(moment().unix(), 3000);
    })

    it('should not set the time to now if a relative date is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)], cmd_arg: "5 days from now"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.not.be.closeTo(moment().unix(), 3000);
    })

    it('should not set the time to now if a relative time is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)], cmd_arg: "5 hours from now"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.not.be.closeTo(moment().unix(), 3000);
    })

    it('should not set the time to now if an english date is passed', () => {
        let instance = new WarclockRequest({command: [WARCLOCK_COMMAND_KEYS.get(WarclockCommand.time)], cmd_arg: "12 Sep"})
        // console.log(moment(instance.time).toString(), instance.time)
        expect(moment(instance.time).unix()).to.not.be.closeTo(moment().unix(), 3000);
    })
});