"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const chrono = __importStar(require("chrono-node"));
const warclock_commands_1 = __importDefault(require("./warclock-commands"));
class WarclockRequest {
    constructor({ id = null, command = ["help"], cmd_arg = null }) {
        this.error = [];
        this.id = +id;
        this.commands = command.map(c => warclock_commands_1.default[c]);
        if (this.commands.includes(warclock_commands_1.default.time)) {
            this.time = cmd_arg;
        }
        else {
            this.description = cmd_arg;
        }
        console.log("Set my params", this);
    }
    set time(value) {
        // @ts-ignore
        moment_1.default.suppressDeprecationWarnings = true;
        let referenceDate = moment_1.default().toDate();
        let parsed = moment_1.default(chrono.parseDate(value, referenceDate));
        if (parsed.isValid())
            this._time = +parsed;
        else {
            this._time = +moment_1.default();
            if (value)
                this.error.push("Your time wasn't formatted right, so I just set it to now and you can edit it later. If you meant to set a time you prolly typed somethin weird. Try doing `YYYY-MM-DD HH:mm+UTCoffset`, that pretty much always works.");
        }
    }
    get time() {
        return this._time;
    }
}
exports.default = WarclockRequest;
//# sourceMappingURL=warclock-request.js.map