import moment from 'moment'
import * as chrono from 'chrono-node';
import WarclockCommand from './warclock-commands'

interface NamedParameters {
    id?: any,
    command?: Array<string>,
    cmd_arg?: string,
}

class WarclockRequest {
    public commands: Array<WarclockCommand>
    public id: number
    public pushid: string
    public description: string
    private _time: number
    set time(value: any) {
        // @ts-ignore
        moment.suppressDeprecationWarnings = true;
        console.log("setting")
        let referenceDate = moment().toDate()
        let parsed = moment(chrono.parseDate(value, referenceDate))
        if (parsed.isValid()) this._time = +parsed
        else {
            this._time = +moment()
            if(value) this.error.push("Your time wasn't formatted right, so I just set it to now and you can edit it later. If you meant to set a time you prolly typed somethin weird. Try doing `YYYY-MM-DD HH:mm+UTCoffset`, that pretty much always works.")
        }
    }
    get time() {
        return this._time;
    }
    public error: Array<string> = []

    public constructor({
        id = null,
        command = ["help"],
        cmd_arg = null
    }: NamedParameters) {
        this.id = +id
        this.commands = command.map(c => WarclockCommand[c])
        if (this.commands.includes(WarclockCommand.time)) {
            this.time = cmd_arg
        } else {
            this.description = cmd_arg
        }

        console.log("Set my params", this)
    }
}

export default WarclockRequest