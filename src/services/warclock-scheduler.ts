import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { WarclockDatabase } from "../data_access/warclock-database";
import { Client, Guild } from "discord.js";
import moment from "moment";

@injectable()
export class WarclockScheduler {
    private warclockDb: WarclockDatabase;
    private client: Client;

    constructor(
        @inject(TYPES.WarclockDatabase) warclockDb: WarclockDatabase,
        @inject(TYPES.Client) client: Client
    ) {
        this.warclockDb = warclockDb;
        this.client = client;
    }

    

    public async scheduleReminders(): Promise<boolean> {
        return this.warclockDb.retrieveDB()
            .then(allWc => {
                let futureWcs = Object.entries(allWc)
                    .filter(async ([guildId, _]) => new Guild(this.client, {id: guildId}).available)
                    .map(([guildId, warclocks]) => {
                        return {
                            ...Object.values(warclocks).filter(clock => {
                                // defaults to checking if after now
                                return moment.unix(clock["time"]).isAfter()
                            })[0] as {},
                            guild: guildId
                        }
                    })
                console.log(futureWcs)
                return true;
            })
    }
}