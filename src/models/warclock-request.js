"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const warclock_commands_1 = __importDefault(require("./warclock-commands"));
class WarclockRequest {
    constructor({ id = null, command = ["help"], description = null, rawtime = null }) {
        this.error = [];
        this.time = rawtime;
        this.id = +id;
        this.commands = command.map(c => warclock_commands_1.default[c]);
        this.description = !!description ? description : null;
    }
    set time(value) {
        // @ts-ignore
        moment_1.default.suppressDeprecationWarnings = true;
        let parsed = moment_1.default(value);
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