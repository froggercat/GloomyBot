"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeFinder = void 0;
const inversify_1 = require("inversify");
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
let MeFinder = class MeFinder {
    constructor(client) {
        this.sassyReplies = [
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
        ];
        this.client = client;
    }
    isTalkingToMe(message) {
        console.log(this.client.user);
        let amITalkingToMyself = message.author.equals(this.client.user);
        let randomlyRespond = Math.random() >= 0.999;
        return !amITalkingToMyself && (randomlyRespond || message.mentions.has(this.client.user));
    }
    respondwSass() {
        let index = Math.floor(Math.random() * this.sassyReplies.length);
        console.log("Getting sassy reply", index);
        return this.sassyReplies[index];
    }
};
MeFinder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __metadata("design:paramtypes", [discord_js_1.Client])
], MeFinder);
exports.MeFinder = MeFinder;
//# sourceMappingURL=me-finder.js.map