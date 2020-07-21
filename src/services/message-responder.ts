import { Message } from "discord.js";
import { PingFinder } from "./ping-finder";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ServerFinder } from "./server-finder";
import { WarclockFinder } from "./warclock-finder";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private serverFinder: ServerFinder;
    private warclockFinder: WarclockFinder;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder,
        @inject(TYPES.ServerFinder) serverFinder: ServerFinder,
        @inject(TYPES.WarclockFinder) warclockFinder: WarclockFinder
    ) {
        this.pingFinder = pingFinder;
        this.serverFinder = serverFinder;
        this.warclockFinder = warclockFinder;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return message.reply('pong!');
        }
        if (this.serverFinder.isServerRequest(message.content)) {
            return message.reply(process.env.SERVER);
        }
        if (this.warclockFinder.isWarclockRequest(message.content)) {
            return message.reply("You asked for clock stuff amirite");
        }

        return Promise.reject();
    }
}