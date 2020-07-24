import { inject, injectable } from "inversify";
import WarclockRequest from "../models/warclock-request";
import { WarclockDatabase } from "../data_access/warclock-database";
import { TYPES } from "../types";
import WarclockCommand from "../models/warclock-commands";
import moment from 'moment'
import Warclock from "../models/warclock";

@injectable()
export class WarclockResponder {
    private db: WarclockDatabase
    private _data: Object
    private cachetimeout: number = 1000000
    private lastQuery: number

    public constructor(
        @inject(TYPES.WarclockDatabase) db: WarclockDatabase
    ) {
        this.db = db
        this.queueCacheRefresh();
    }

    private queueCacheRefresh() {
        let updateCache = async () => {
            console.log(`[${moment()}] About to update wc cache`);
            await this.updateDB();
            console.log(`[${moment()}] Kicking off data staleness timeout. Update planned for ${moment().add(this.cachetimeout, 'milliseconds')}`)
            setTimeout(updateCache, this.cachetimeout);
        }
        console.log(`[${moment()}] Kicking off data staleness timeout. Update planned for ${moment().add(this.cachetimeout, 'milliseconds')}`)
        setTimeout(updateCache, this.cachetimeout)
    }

    private prettyPrint(firebaseWarclocks: Object): string {
        let reply = Object.values(firebaseWarclocks).map((clock => {
            return `**${clock.id}:** ${clock.description} - ${moment.unix(clock.time).fromNow()}`
        }))
        return "k you asked for clock(s):\n" + reply.join("\n")
    }

    private async updateDB(successCB = (results) => { }, errorCB = (error) => { }) {
        await this.db.retrieveDB()
            .then(results => {
                this.lastQuery = +moment()
                console.log(`[${moment(this.lastQuery)}] Retrieved fresh data`)
                this._data = results
                console.log("updateDB-> retrieveDB results", results)
                if (!!results) {
                    Object.values(this._data).forEach((value, index) => {
                        console.log(value)
                        value["id"] = index;
                    })
                }
                successCB(results)
            })
            .catch(error => {
                console.log(`[${moment()}] ERROR retrieving firebase warclock data:\n${error}`)
                errorCB(error)
            })
        return this._data;
    }

    private async getData(successCB = (results) => { }, errorCB = (error) => { }) {
        if (!!this._data && +moment() <= this.lastQuery + this.cachetimeout) {
            successCB(this._data);
            return this._data;
        }
        return await this.updateDB(successCB, errorCB)
    }

    public async getResponse(message: WarclockRequest, guild: string): Promise<string> {
        this.db.guild = guild;
        let reply = "you want clock stuff amirite";
        let fbKey = "";
        console.log("getting response for message", message);
        if (message.commands.length > 1 && WarclockCommand.help in message.commands) {
            switch (message.commands[0]) {
                case (WarclockCommand.id):
                    reply = `so basically, you put in the id number to retrive a single clock. Like: \`wc 0\` is gonna get your first clock.`
                    break;
                case (WarclockCommand.list):
                    reply = `honestly you should just run \`wc list\` instead of asking me about it. If you got clocks I'll give 'em to you.`
                    break;
                case (WarclockCommand.reset):
                    reply = `this allows you to reset your clock's timer to right now. You gotta give me an id though, like \`wc 0 reset\`. Yes, I know the formatting's different than ub3r, gotta keep you on your toes.`
                    break;
                case (WarclockCommand.set):
                    reply = `ooh, so you're interested in the thing I do dat ub3r don't. Well, sometimes you want to edit a clock. You can change either the time or the description, but not both. For example:
                    \`wc 0 set time 2020-01-01\` is gonna change the start time of your #0 clock to be 2020-01-01. I let a library called moment.js handle date reading, go check it out here (https://momentjs.com/docs/#/parsing/) if you want to get fancy.
                    \`wc 0 set description something new\` will change the clock's name to "something new". Caveat, your clock names can't end with "help" because then I will think you need help messages like these.
                    You cannot do something like \`wc set time 2020 set description hi\` ... I mean, I won't stop you, but I can't promise things will end well for you.`
                    break;
                case (WarclockCommand.start):
                    reply = `this just creates a new clock starting right now with the description you give it. Like:
                    \`wc start a clock thing\` will create a clock ticking up from now called "start a clock thing".`
                    break;
                case (WarclockCommand.stop):
                    reply = `this is honestly a delete command, it will stop the clock of your choosing. Use it like:
                    \`wc 0 stop\` to stop your clock with id 0.`
                    break;
                default:
                    reply = "ngl you really shouldn't be able to see this message .... er, hi? You should probably run \`wc help\`."
            }
            return reply;
        }
        switch (message.commands[0]) {
            case (WarclockCommand.id):
                console.log("Receive id list command")
                await this.getData(() => {
                    let candidates = Object.entries(this._data).filter(([k, v]) => {
                        return v.id === message.id
                    })
                    console.log("candidates", !!candidates.length, candidates)
                    fbKey = !!candidates.length ? candidates[0][0] : ""
                    let item = this._data[fbKey]
                    console.log("item:", !!item, item)
                    reply = !!item ? this.prettyPrint({ [fbKey]: item }) : "that's not a valid clock id, run `wc list` to get clocks. Sometimes I change the id's on you ;)"
                })
                break;
            case (WarclockCommand.list):
                await this.getData(() => {
                    reply = !!this._data ? this.prettyPrint(this._data) : "this server don't got any clocks"
                }, () => {
                    reply = "Sorry something went wrong, I told my human tho"
                })
                break;
            case (WarclockCommand.start):
                this.db.saveWC(new Warclock(message.time, message.description))
                reply = "k i saved your event"
                this.markDataAsStale()
                break;
            case (WarclockCommand.stop):
                console.log("Received stop request")
                await this.getData(() => {
                    fbKey = Object.entries(this._data).filter(([k, v]) => {
                        return v.id === message.id
                    })[0][0]
                    this.db.clearData([fbKey])
                    reply = `cleared timer '${this._data[fbKey].description}'`
                })
            case (WarclockCommand.reset):
                console.log("Received reset request")
                await this.getData(() => {
                    fbKey = Object.entries(this._data).filter(([k, v]) => {
                        return v.id === message.id
                    })[0][0]
                    this._data[fbKey].time = moment().utc()
                    this.db.saveWC(new Warclock(moment().utc(), this._data[fbKey].description), fbKey)
                    this.markDataAsStale()
                    reply = `restarted the timer '${this._data[fbKey].description}'`
                })
                break;
            case (WarclockCommand.set):
                console.log("Received Update Request", message)
                await this.getData(() => {
                    console.log(this._data)
                    fbKey = Object.entries(this._data).filter(([k, v]) => {
                        return v.id === message.id
                    })[0][0]
                    let params = message.description.split(/ (.+)/)
                    console.log(params)
                    let wc = params[0] === "time"
                        ? new Warclock(moment(params[1]).utc(), this._data[fbKey].description)
                        : new Warclock(moment.unix(this._data[fbKey].time), params[1])
                    this.db.saveWC(wc, fbKey)
                    this.markDataAsStale()
                    reply = `Updated warclock id #${message.id}: set ${params[0]} to ${params[1]}`
                })
                break;
            case (WarclockCommand.help):
            default:
                reply = `dis command creates a clock to track how much time has passed since a particular event.
                Unlike my ub3r competitor over there, you can set the start time to whatever you want.
                Lmk if you need help with a specific command by tacking \`help\` onto the end of whatever.
                Btw \`#id\` means type in the id. Run \`wc list\` to check your id's first.
                Usage: \`wc #id\` \`wc list\` \`wc start <text>\` \`wc #id stop\` \`wc #id reset\` \`wc #id set <time|description> <value>\`
                FYI I will also respond to \`.wc\`, \`!wc\` and \`?wc\` instead of \`wc\`.
                `
        }
        return reply;
    }
    markDataAsStale() {
        console.log("Data will be pulled from db on next query")
        this.lastQuery = moment().unix();
    }
}