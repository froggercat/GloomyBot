"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class Warclock {
    constructor(time, description) {
        this.time = moment_1.default(time).unix();
        this.description = description;
    }
}
exports.default = Warclock;
//# sourceMappingURL=warclock.js.map