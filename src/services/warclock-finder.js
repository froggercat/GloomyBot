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
    }
    isWarclockRequest(stringToSearch) {
        return stringToSearch.search(this.regexp) >= 0;
    }
    parseWarclockRequest(commandToParse) {
        return new warclock_request_1.default({});
    }
};
WarclockFinder = __decorate([
    inversify_1.injectable()
], WarclockFinder);
exports.WarclockFinder = WarclockFinder;
//# sourceMappingURL=warclock-finder.js.map