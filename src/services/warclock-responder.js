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
exports.WarclockResponder = void 0;
const inversify_1 = require("inversify");
const warclock_database_1 = require("../data_access/warclock-database");
const types_1 = require("../types");
const warclock_commands_1 = __importDefault(require("../models/warclock-commands"));
const moment_1 = __importDefault(require("moment"));
const warclock_1 = __importDefault(require("../models/warclock"));
const warclock_strings_1 = __importDefault(require("../command_strings/warclock-strings"));
let WarclockResponder = class WarclockResponder {
    constructor(db) {
        this.cachetimeout = 1000000;
        this.db = db;
        this.queueCacheRefresh();
    }
    queueCacheRefresh() {
        let updateCache = () => __awaiter(this, void 0, void 0, function* () {
            console.log(`[${moment_1.default()}] About to update wc cache`);
            yield this.updateDB();
            console.log(`[${moment_1.default()}] Kicking off data staleness timeout. Update planned for ${moment_1.default().add(this.cachetimeout, 'milliseconds')}`);
            setTimeout(updateCache, this.cachetimeout);
        });
        console.log(`[${moment_1.default()}] Kicking off data staleness timeout. Update planned for ${moment_1.default().add(this.cachetimeout, 'milliseconds')}`);
        setTimeout(updateCache, this.cachetimeout);
    }
    prettyPrint(firebaseWarclocks) {
        let reply = Object.values(firebaseWarclocks).map((clock => {
            return `**${clock.id}:** ${clock.description} - ${moment_1.default.unix(clock.time).fromNow()}`;
        }));
        return "k you asked for clock(s):\n" + reply.join("\n");
    }
    updateDB(successCB = (results) => { }, errorCB = (error) => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.retrieveDB()
                .then(results => {
                this.lastQuery = +moment_1.default();
                console.log(`[${moment_1.default(this.lastQuery)}] Retrieved fresh data`);
                this._data = results;
                console.log("updateDB-> retrieveDB results", results);
                if (!!results) {
                    Object.values(this._data).forEach((value, index) => {
                        console.log(value);
                        value["id"] = index;
                    });
                }
                successCB(results);
            })
                .catch(error => {
                console.log(`[${moment_1.default()}] ERROR retrieving firebase warclock data:\n${error}`);
                errorCB(error);
            });
            return this._data;
        });
    }
    getData(successCB = (results) => { }, errorCB = (error) => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this._data && +moment_1.default() <= this.lastQuery + this.cachetimeout) {
                successCB(this._data);
                return this._data;
            }
            return yield this.updateDB(successCB, errorCB);
        });
    }
    getResponse(message, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db.guild !== guild)
                this.markDataAsStale();
            this.db.guild = guild;
            let reply = warclock_strings_1.default.filter(str => str.cmd == 'failure')[0].help;
            let fbKey = "";
            console.log("getting response for message", message);
            if (message.commands.length > 1 && message.commands.includes(warclock_commands_1.default.help)) {
                console.log(`User needs help with a command, found ${warclock_commands_1.default.help} in ${message.commands}`);
                switch (message.commands[0]) {
                    case (warclock_commands_1.default.id):
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.id)[0].help;
                        break;
                    case (warclock_commands_1.default.list):
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.list)[0].help;
                        break;
                    case (warclock_commands_1.default.reset):
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.reset)[0].help;
                        break;
                    case (warclock_commands_1.default.set):
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.set)[0].help;
                        break;
                    case (warclock_commands_1.default.start):
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.start)[0].help;
                        break;
                    case (warclock_commands_1.default.stop):
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.stop)[0].help;
                        break;
                    default:
                        reply = warclock_strings_1.default.filter(str => str.cmd == 'default')[0].help;
                }
                return reply;
            }
            switch (message.commands[0]) {
                case (warclock_commands_1.default.id):
                    console.log("Receive id list command");
                    yield this.getData(() => {
                        let candidates = Object.entries(this._data).filter(([k, v]) => {
                            return v.id === message.id;
                        });
                        console.log("candidates", !!candidates.length, candidates);
                        fbKey = !!candidates.length ? candidates[0][0] : "";
                        let item = this._data[fbKey];
                        console.log("item:", !!item, item);
                        reply = !!item ? this.prettyPrint({ [fbKey]: item }) : warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.id)[0].error;
                    });
                    break;
                case (warclock_commands_1.default.list):
                    yield this.getData(() => {
                        reply = !!this._data ? this.prettyPrint(this._data) : "this server don't got any clocks";
                    }, () => {
                        reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.list)[0].error;
                    });
                    break;
                case (warclock_commands_1.default.start):
                    this.db.saveWC(new warclock_1.default(message.time, message.description));
                    reply = "k i saved your event";
                    this.markDataAsStale();
                    break;
                case (warclock_commands_1.default.stop):
                    console.log("Received stop request");
                    yield this.getData(() => {
                        fbKey = Object.entries(this._data).filter(([k, v]) => {
                            return v.id === message.id;
                        })[0][0];
                        this.db.clearData([fbKey]);
                        reply = `cleared timer '${this._data[fbKey].description}'`;
                    });
                case (warclock_commands_1.default.reset):
                    console.log("Received reset request");
                    yield this.getData(() => {
                        fbKey = Object.entries(this._data).filter(([k, v]) => {
                            return v.id === message.id;
                        })[0][0];
                        this._data[fbKey].time = moment_1.default().utc();
                        this.db.saveWC(new warclock_1.default(moment_1.default().utc(), this._data[fbKey].description), fbKey);
                        this.markDataAsStale();
                        reply = `restarted the timer '${this._data[fbKey].description}'`;
                    });
                    break;
                case (warclock_commands_1.default.set):
                    console.log("Received Update Request", message);
                    yield this.getData(() => {
                        console.log(this._data);
                        fbKey = Object.entries(this._data).filter(([k, v]) => {
                            return v.id === message.id;
                        })[0][0];
                        let wc = message.commands[1] === warclock_commands_1.default.time
                            ? new warclock_1.default(message.time, this._data[fbKey].description)
                            : new warclock_1.default(moment_1.default.unix(this._data[fbKey].time), message.description);
                        this.db.saveWC(wc, fbKey);
                        this.markDataAsStale();
                        reply = `${message.error ? "\n\t" + message.error.join("\n\t") + "\n\n" : ""}Updated warclock id #${message.id}: set ${message.commands[1]} to ${moment_1.default.unix(wc.time)}`;
                    });
                    break;
                case (warclock_commands_1.default.help):
                default:
                    reply = warclock_strings_1.default.filter(str => str.cmd == warclock_commands_1.default.help)[0].help;
            }
            return reply;
        });
    }
    markDataAsStale() {
        console.log("Data will be pulled from db on next query");
        this.lastQuery = moment_1.default().unix();
    }
};
WarclockResponder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.WarclockDatabase)),
    __metadata("design:paramtypes", [warclock_database_1.WarclockDatabase])
], WarclockResponder);
exports.WarclockResponder = WarclockResponder;
//# sourceMappingURL=warclock-responder.js.map