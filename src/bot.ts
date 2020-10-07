import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { MessageResponder } from "./services/message-responder";
import { TaskScheduler } from "./services/task-scheduler";

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private messageResponder: MessageResponder;
    private taskScheduler: TaskScheduler;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageResponder) messageResponder: MessageResponder,
        @inject(TYPES.TaskScheduler) taskScheduler: TaskScheduler) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
        this.taskScheduler = taskScheduler;
    }

    public init(): void {
        this.taskScheduler.init()
    }

    public listen(): Promise<string> {
        this.client.on('message', (message: Message) => {

            console.log("Message received! Contents: ", message.content);

            this.messageResponder.handle(message).then(() => {
                console.log("Response sent!");
            }).catch(() => {
                console.log("Response not sent.")
            })
        });

        return this.client.login(this.token);
    }
}