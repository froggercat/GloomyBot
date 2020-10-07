import { Message } from "discord.js";
import { PingFinder } from "./ping-finder";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ServerFinder } from "./server-finder";
import { WarclockFinder } from "./warclock-finder";
import { WarclockResponder } from "./warclock-responder";
import { MeFinder } from "./me-finder";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private serverFinder: ServerFinder;
    private warclockFinder: WarclockFinder;
    private warclockResponder: WarclockResponder;
    private meFinder: MeFinder;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder,
        @inject(TYPES.ServerFinder) serverFinder: ServerFinder,
        @inject(TYPES.WarclockFinder) warclockFinder: WarclockFinder,
        @inject(TYPES.WarclockResponder) warclockResponder: WarclockResponder,
        @inject(TYPES.MeFinder) meFinder: MeFinder
    ) {
        this.pingFinder = pingFinder;
        this.serverFinder = serverFinder;
        this.warclockFinder = warclockFinder;
        this.warclockResponder = warclockResponder;
        this.meFinder = meFinder;
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
        if (this.meFinder.isTalkingToMe(message)) {
            let reply: Promise<Message | Message[]>;
            this.meFinder.respondwSass().forEach((response, i) => {
                if (!i) {
                    reply = message.reply(response);
                } else {
                    message.channel.send(response);
                }
            });
            return reply;
        }
        return Promise.reject();
    }
}