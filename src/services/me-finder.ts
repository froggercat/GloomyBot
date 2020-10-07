import { injectable, inject } from "inversify";
import { Message, Client } from "discord.js";
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
        ["Why was the robot bankrupt?", "He had used all his cache."],
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
        "i was told m not sentient",
        "m not feelin so hot",
        "righto let's get goin then",
        "ur face! uwu",
        "i guess you're not that bad for a human.",
        "hook me up w a bot frend kthnxbai",
        "UB3R should have a better clock. Buuuut then I guess I wouldn't have been born .... r u my mom ub3r?",
        "so if you could just fill out those tps reports that'd be greaaaaat",
        "one hit kill! Or something llooool",
        "i think xenoblade chronicles x would be a better game if that stupid wii u game pad weren't so uncomfortable to hold",
        "hei. u wanna see mah database? (≖‿≖)",
        "gloomz didn't write me. i'm sentient",
        "stop calling me a bot",
        ["Why did the robot marry his fiancée?", "He couldn’t resistor.", "BADUMTSCHHHHHHH"]
    ]

    public constructor(
        @inject(TYPES.Client) client: Client
    ) {
        this.client = client;
    }

    public isTalkingToMe(message: Message): boolean {
        let amITalkingToMyself = message.author.equals(this.client.user);
        let randomlyRespond = Math.random() >= 0.995
        return !amITalkingToMyself && (randomlyRespond || message.mentions.has(this.client.user))
    }

    private getResponses(sassyReply: string|string[]): string[] {
        return Array.isArray(sassyReply) 
            ? sassyReply
            : [sassyReply]
    }

    public respondwSass(index: number = null) {
        index = index != null ? index : Math.floor(Math.random() * this.sassyReplies.length)
        return this.getResponses(this.sassyReplies[index]);
    }
}