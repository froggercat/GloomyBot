import moment from 'moment'

enum WarclockCommand {
    default,
    list,
    start,
    stop,
    reset,
    help
}

interface NamedParameters {
    id?: number,
    command?: WarclockCommand,
    description?: string,
    rawtime?: any
}

class WarclockRequest {
    public command: WarclockCommand
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
            this.error.push("Your time wasn't formatted right, so I just set it to now and you can edit it later. I'm pretty flexible so you prolly typed somethin weird. All else fails, try doing `YYYY-MM-DD HH:mm+UTCoffset`, that pretty much always works.")
        }
    }
    get time() {
        return this._time;
    }
    public error: Array<string> = []

    public constructor({
        id = null,
        command = WarclockCommand.default,
        description = null,
        rawtime = null
    }: NamedParameters) {
        this.time = rawtime
        this.id = id
        this.command = command
        this.description = !!description ? description : null
    }
}

export default WarclockRequest