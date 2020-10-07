"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarclockDatabase = void 0;
const inversify_1 = require("inversify");
const database_access_1 = require("./database-access");
let WarclockDatabase = class WarclockDatabase extends database_access_1.DatabaseAccess {
    saveWC(wc, key = "") {
        if (!!key)
            this.connection.ref.child(key).set(wc);
        else
            this.connection.ref.push(wc);
        return !!key ? this.connection.ref.child(key) : this.connection.ref;
    }
};
WarclockDatabase = __decorate([
    inversify_1.injectable()
], WarclockDatabase);
exports.WarclockDatabase = WarclockDatabase;
//# sourceMappingURL=warclock-database.js.map