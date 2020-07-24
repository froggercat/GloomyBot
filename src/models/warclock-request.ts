import moment from 'moment'
import WarclockCommand from './warclock-commands'

interface NamedParameters {
    id?: any,
    command?: Array<string>,
    description?: string,
    rawtime?: any
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
        let parsed = moment(value)
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
        description = null,
        rawtime = null
    }: NamedParameters) {
        this.time = rawtime
        this.id = +id
        this.commands = command.map(c => WarclockCommand[c])
        this.description = !!description ? description : null
    }
}

export default WarclockRequest