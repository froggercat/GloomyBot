import { Message } from "discord.js";
import { PingFinder } from "./ping-finder";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ServerFinder } from "./server-finder";
import { WarclockFinder } from "./warclock-finder";
import { WarclockResponder } from "./warclock-responder";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private serverFinder: ServerFinder;
    private warclockFinder: WarclockFinder;
    private warclockResponder: WarclockResponder;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder,
        @inject(TYPES.ServerFinder) serverFinder: ServerFinder,
        @inject(TYPES.WarclockFinder) warclockFinder: WarclockFinder,
        @inject(TYPES.WarclockResponder) warclockResponder: WarclockResponder
    ) {
        this.pingFinder = pingFinder;
        this.serverFinder = serverFinder;
        this.warclockFinder = warclockFinder;
        this.warclockResponder = warclockResponder;
    }

    async handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return message.reply('pong!');
        }
        if (this.serverFinder.isServerRequest(message.content)) {
            return message.reply(process.env.SERVER);
        }
        if (this.warclockFinder.isWarclockRequest(message.content)) {
            let wcCommand = this.warclockFinder.parseWarclockRequest(message.content);
            let response = await this.warclockResponder.getResponse(wcCommand, message.guild.id);
            return message.reply(response);
        }

        return Promise.reject();
    }
}