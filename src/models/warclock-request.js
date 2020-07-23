"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
var WarclockCommand;
(function (WarclockCommand) {
    WarclockCommand[WarclockCommand["default"] = 0] = "default";
    WarclockCommand[WarclockCommand["list"] = 1] = "list";
    WarclockCommand[WarclockCommand["start"] = 2] = "start";
    WarclockCommand[WarclockCommand["stop"] = 3] = "stop";
    WarclockCommand[WarclockCommand["reset"] = 4] = "reset";
    WarclockCommand[WarclockCommand["help"] = 5] = "help";
})(WarclockCommand || (WarclockCommand = {}));
class WarclockRequest {
    constructor({ id = null, command = WarclockCommand.default, description = null, rawtime = null }) {
        this.error = [];
        this.time = rawtime;
        this.id = id;
        this.command = command;
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
            this.error.push("Your time wasn't formatted right, so I just set it to now and you can edit it later. I'm pretty flexible so you prolly typed somethin weird. All else fails, try doing `YYYY-MM-DD HH:mm+UTCoffset`, that pretty much always works.");
        }
    }
    get time() {
        return this._time;
    }
}
exports.default = WarclockRequest;
//# sourceMappingURL=warclock-request.js.map