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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarclockScheduler = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const warclock_database_1 = require("../data_access/warclock-database");
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
let WarclockScheduler = class WarclockScheduler {
    constructor(warclockDb, client) {
        this.warclockDb = warclockDb;
        this.client = client;
    }
    scheduleReminders() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.warclockDb.retrieveDB()
                .then(allWc => {
                let futureWcs = Object.entries(allWc)
                    .filter(([guildId, _]) => __awaiter(this, void 0, void 0, function* () { return new discord_js_1.Guild(this.client, { id: guildId }).available; }))
                    .map(([guildId, warclocks]) => {
                    return Object.assign(Object.assign({}, Object.values(warclocks).filter(clock => {
                        // defaults to checking if after now
                        return moment_1.default.unix(clock["time"]).isAfter();
                    })[0]), { guild: guildId });
                });
                console.log(futureWcs);
                return true;
            });
        });
    }
};
WarclockScheduler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.WarclockDatabase)),
    __param(1, inversify_1.inject(types_1.TYPES.Client)),
    __metadata("design:paramtypes", [warclock_database_1.WarclockDatabase,
        discord_js_1.Client])
], WarclockScheduler);
exports.WarclockScheduler = WarclockScheduler;
//# sourceMappingURL=warclock-scheduler.js.map