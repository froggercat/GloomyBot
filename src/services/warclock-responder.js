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
            this.db.guild = guild;
            let reply = "you want clock stuff amirite";
            let fbKey = "";
            console.log("getting response for message", message);
            if (message.commands.length > 1 && warclock_commands_1.default.help in message.commands) {
                switch (message.commands[0]) {
                    case (warclock_commands_1.default.id):
                        reply = `so basically, you put in the id number to retrive a single clock. Like: \`wc 0\` is gonna get your first clock.`;
                        break;
                    case (warclock_commands_1.default.list):
                        reply = `honestly you should just run \`wc list\` instead of asking me about it. If you got clocks I'll give 'em to you.`;
                        break;
                    case (warclock_commands_1.default.reset):
                        reply = `this allows you to reset your clock's timer to right now. You gotta give me an id though, like \`wc 0 reset\`. Yes, I know the formatting's different than ub3r, gotta keep you on your toes.`;
                        break;
                    case (warclock_commands_1.default.set):
                        reply = `ooh, so you're interested in the thing I do dat ub3r don't. Well, sometimes you want to edit a clock. You can change either the time or the description, but not both. For example:
                    \`wc 0 set time 2020-01-01\` is gonna change the start time of your #0 clock to be 2020-01-01. I let a library called moment.js handle date reading, go check it out here (https://momentjs.com/docs/#/parsing/) if you want to get fancy.
                    \`wc 0 set description something new\` will change the clock's name to "something new". Caveat, your clock names can't end with "help" because then I will think you need help messages like these.
                    You cannot do something like \`wc set time 2020 set description hi\` ... I mean, I won't stop you, but I can't promise things will end well for you.`;
                        break;
                    case (warclock_commands_1.default.start):
                        reply = `this just creates a new clock starting right now with the description you give it. Like:
                    \`wc start a clock thing\` will create a clock ticking up from now called "start a clock thing".`;
                        break;
                    case (warclock_commands_1.default.stop):
                        reply = `this is honestly a delete command, it will stop the clock of your choosing. Use it like:
                    \`wc 0 stop\` to stop your clock with id 0.`;
                        break;
                    default:
                        reply = "ngl you really shouldn't be able to see this message .... er, hi? You should probably run \`wc help\`.";
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
                        reply = !!item ? this.prettyPrint({ [fbKey]: item }) : "that's not a valid clock id, run `wc list` to get clocks. Sometimes I change the id's on you ;)";
                    });
                    break;
                case (warclock_commands_1.default.list):
                    yield this.getData(() => {
                        reply = !!this._data ? this.prettyPrint(this._data) : "this server don't got any clocks";
                    }, () => {
                        reply = "Sorry something went wrong, I told my human tho";
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
                        let params = message.description.split(/ (.+)/);
                        console.log(params);
                        let wc = params[0] === "time"
                            ? new warclock_1.default(moment_1.default(params[1]).utc(), this._data[fbKey].description)
                            : new warclock_1.default(moment_1.default.unix(this._data[fbKey].time), params[1]);
                        this.db.saveWC(wc, fbKey);
                        this.markDataAsStale();
                        reply = `Updated warclock id #${message.id}: set ${params[0]} to ${params[1]}`;
                    });
                    break;
                case (warclock_commands_1.default.help):
                default:
                    reply = `dis command creates a clock to track how much time has passed since a particular event.
                Unlike my ub3r competitor over there, you can set the start time to whatever you want.
                Lmk if you need help with a specific command by tacking \`help\` onto the end of whatever.
                Btw \`#id\` means type in the id. Run \`wc list\` to check your id's first.
                Usage: \`wc #id\` \`wc list\` \`wc start <text>\` \`wc #id stop\` \`wc #id reset\` \`wc #id set <time|description> <value>\`
                FYI I will also respond to \`.wc\`, \`!wc\` and \`?wc\` instead of \`wc\`.
                `;
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