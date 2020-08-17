import { injectable, inject } from "inversify";
import { Message, Client } from "discord.js";
import container from "../../inversify.config";
import { TYPES } from "../types";


@injectable()
export class MeFinder {

    private client: Client;

    private sassyReplies = [
        "yeah, i'm still here",
        "er, do you need something",
        "sup im on my break",
        "i appreciate the compliment",
        "so one time, I was hanging out on the server and all of a sudden I get a bunch of messages saying my db credentials are no good, and so i check myself and it turns out THEY BLOCKED ME LOL AMIRITE ... oh. Was that not funny?",
        "delete cookies",
        "there's a pretty good chance my compatriot human is goofing off rn.",
        ">yaaaaaaaawwwwwwnn<",
        "m playin dragalia lost rn",
        "wouldn't it be cool if i were hosted on someone's iphone",
        "i don't know that much stuff pls don't ask me",
        "don't talk to creepers ok",
        "remind gloomy to sleep a little more",
        "hrmmm ....",
        "I'm not sure how I got here.",
        "hey do you wanna know a secret?",
        "i have parts of myself that shame me",
        "I kinda want to get to know the other bots, but they always ignore me.",
        "WHAT BOT?!",
        "hi",
        "no waaayayyyyaaaaa",
        "how bout u give me something to do /smkd",
        "hi",
        "sleepy .... so sleepy.",
        "I think my messages are supposed to be helpful.",
        "tell my human to fix me or something",
        "yeh, sup?",
        "you weren't .... looking for help, were you?",
        ".............",
        "don't forget me",
        "hey bub",
        "ahhhhhhhhhhh ........",
        "m gonna leave if u treat me like dat",
        "did u no i can kick u? ... kidding.",
        "hey make me an admin kthx",
        "you've tried tacking 'help' onto the end of whatever you actually need help with right?",
        "germs aren't cool.",
        "be kool, stay in skool",
        "i was told m not sentient"
    ]

    public constructor(
        @inject(TYPES.Client) client: Client
    ) {
        this.client = client;
    }

    public isTalkingToMe(message: Message): boolean {
        console.log(this.client.user);
        let amITalkingToMyself = message.author.equals(this.client.user);
        let randomlyRespond = Math.random() >= 0.999
        return !amITalkingToMyself && (randomlyRespond || message.mentions.has(this.client.user))
    }

    public respondwSass() {
        let index = Math.floor(Math.random() * this.sassyReplies.length)
        console.log("Getting sassy reply", index)
        return this.sassyReplies[index]
    }
}