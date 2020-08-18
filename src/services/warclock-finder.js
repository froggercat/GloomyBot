"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarclockFinder = void 0;
const inversify_1 = require("inversify");
const warclock_request_1 = __importDefault(require("../models/warclock-request"));
let WarclockFinder = class WarclockFinder {
    constructor() {
        this.regexp = /^[\.!\?]{0,1}wc/g;
        this.parser_regexp = /^\S+\s+#*([0-9]*)\s*(id|list|set|start|stop|set|reset)?\s*(time|description)?\s*(.*)/gm;
        this.help_regexp = /help$/gm;
    }
    isWarclockRequest(stringToSearch) {
        return stringToSearch.search(this.regexp) >= 0;
    }
    parseWarclockRequest(commandToParse) {
        let match, params = {};
        while (match = this.parser_regexp.exec(commandToParse)) {
            console.log("Regex parsing broke down command as follows:", commandToParse, "=>", match);
            if (!!match[1]) {
                console.log("ID argument found");
                params["id"] = match[1];
                params["command"] = ["id"];
            }
            if (!!match[2]) {
                console.log("Command argument found");
                params["command"] = [match[2]];
            }
            if (!!match[3]) {
                console.log("Secondary Command argument found:", match[3]);
                params["command"].push(match[3]);
            }
            if (!!match[4]) {
                console.log("Secondary command argument:", match[4]);
                params["cmd_arg"] = match[4];
            }
        }
        while (match = this.help_regexp.exec(commandToParse)) {
            console.log("User needs help");
            if (!!params["command"])
                params["command"].push("help");
            else
                params["command"] = ["help"];
        }
        let result = new warclock_request_1.default(params);
        console.log(result);
        return result;
    }
};
WarclockFinder = __decorate([
    inversify_1.injectable()
], WarclockFinder);
exports.WarclockFinder = WarclockFinder;
//# sourceMappingURL=warclock-finder.js.map