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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResponder = void 0;
const ping_finder_1 = require("./ping-finder");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const server_finder_1 = require("./server-finder");
const warclock_finder_1 = require("./warclock-finder");
const warclock_responder_1 = require("./warclock-responder");
const me_finder_1 = require("./me-finder");
let MessageResponder = class MessageResponder {
    constructor(pingFinder, serverFinder, warclockFinder, warclockResponder, meFinder) {
        this.pingFinder = pingFinder;
        this.serverFinder = serverFinder;
        this.warclockFinder = warclockFinder;
        this.warclockResponder = warclockResponder;
        this.meFinder = meFinder;
    }
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pingFinder.isPing(message.content)) {
                return message.reply('pong!');
            }
            if (this.serverFinder.isServerRequest(message.content)) {
                return message.reply(process.env.SERVER);
            }
            if (this.warclockFinder.isWarclockRequest(message.content)) {
                let wcCommand = this.warclockFinder.parseWarclockRequest(message.content);
                let response = yield this.warclockResponder.getResponse(wcCommand, message.guild.id);
                return message.reply(response);
            }
            if (this.meFinder.isTalkingToMe(message)) {
                return message.reply(this.meFinder.respondwSass());
            }
            return Promise.reject();
        });
    }
};
MessageResponder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PingFinder)),
    __param(1, inversify_1.inject(types_1.TYPES.ServerFinder)),
    __param(2, inversify_1.inject(types_1.TYPES.WarclockFinder)),
    __param(3, inversify_1.inject(types_1.TYPES.WarclockResponder)),
    __param(4, inversify_1.inject(types_1.TYPES.MeFinder)),
    __metadata("design:paramtypes", [ping_finder_1.PingFinder,
        server_finder_1.ServerFinder,
        warclock_finder_1.WarclockFinder,
        warclock_responder_1.WarclockResponder,
        me_finder_1.MeFinder])
], MessageResponder);
exports.MessageResponder = MessageResponder;
//# sourceMappingURL=message-responder.js.map