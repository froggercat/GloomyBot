import { Message } from "discord.js";
import { PingFinder } from "./ping-finder";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ServerFinder } from "./server-finder";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private serverFinder: ServerFinder;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder,
        @inject(TYPES.ServerFinder) serverFinder: ServerFinder
    ) {
        this.pingFinder = pingFinder;
        this.serverFinder = serverFinder;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return message.reply('pong!');
        }
        if (this.serverFinder.isServerRequest(message.content)) {
            return message.reply(process.env.SERVER);
        }

        return Promise.reject();
    }
}