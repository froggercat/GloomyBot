import { inject, injectable } from "inversify";
import WarclockRequest from "../models/warclock-request";
import { WarclockDatabase } from "../data_access/warclock-database";
import { TYPES } from "../types";
import WarclockCommand from "../models/warclock-commands";
import moment from 'moment'
import Warclock from "../models/warclock";
import warclockStrings from "../command_strings/warclock-strings";

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
        if (this.db.guild !== guild) this.markDataAsStale()
        this.db.guild = guild;
        let reply = warclockStrings.filter(str => str.cmd == 'failure')[0].help;
        let fbKey = "";
        console.log("getting response for message", message);
        if (message.commands.length > 1 && message.commands.includes(WarclockCommand.help)) {
            console.log(`User needs help with a command, found ${WarclockCommand.help} in ${message.commands}`)
            switch (message.commands[0]) {
                case (WarclockCommand.id):
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.id)[0].help
                    break;
                case (WarclockCommand.list):
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.list)[0].help                    
                    break;
                case (WarclockCommand.reset):
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.reset)[0].help
                    break;
                case (WarclockCommand.set):
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.set)[0].help
                    break;
                case (WarclockCommand.start):
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.start)[0].help
                    break;
                case (WarclockCommand.stop):
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.stop)[0].help
                    break;
                default:
                    reply = warclockStrings.filter(str => str.cmd == 'default')[0].help
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
                    reply = !!item ? this.prettyPrint({ [fbKey]: item }) : warclockStrings.filter(str => str.cmd == WarclockCommand.id)[0].error
                })
                break;
            case (WarclockCommand.list):
                await this.getData(() => {
                    reply = !!this._data ? this.prettyPrint(this._data) : "this server don't got any clocks"
                }, () => {
                    reply = warclockStrings.filter(str => str.cmd == WarclockCommand.list)[0].error
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
                    let wc = message.commands[1] === WarclockCommand.time
                        ? new Warclock(message.time, this._data[fbKey].description)
                        : new Warclock(moment.unix(this._data[fbKey].time), message.description)
                    this.db.saveWC(wc, fbKey)
                    this.markDataAsStale()
                    reply = `${message.error ? "\n\t" + message.error.join("\n\t") + "\n\n" : ""}Updated warclock id #${message.id}: set ${message.commands[1]} to ${moment.unix(wc.time)}`
                })
                break;
            case (WarclockCommand.help):
            default:
                reply = warclockStrings.filter(str => str.cmd == WarclockCommand.help)[0].help
        }
        return reply;
    }
    markDataAsStale() {
        console.log("Data will be pulled from db on next query")
        this.lastQuery = moment().unix();
    }
}