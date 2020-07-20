import { Message } from "discord.js";
import { PingFinder } from "./ping-finder";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ServerDetailsFinder } from "./server-details-finder";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private serverFinder: ServerDetailsFinder;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder,
        @inject(TYPES.ServerDetailsFinder) serverFinder: ServerDetailsFinder
    ) {
        this.pingFinder = pingFinder;
        this.serverFinder = serverFinder;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return message.reply('pong!');
        }
        if (this.serverFinder.isServerDetailsRequest(message.content)) {
            return message.reply(process.env.SERVER);
        }

        return Promise.reject();
    }
}