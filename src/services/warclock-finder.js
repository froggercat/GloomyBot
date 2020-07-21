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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarclockFinder = void 0;
const inversify_1 = require("inversify");
const admin = require("firebase-admin");
const types_1 = require("../types");
let WarclockFinder = class WarclockFinder {
    constructor(dbURL, gCredPath) {
        this.regexp = /^[\.!\?]{0,1}wc/g;
        this.gCredPath = gCredPath;
        this.dbURL = dbURL;
    }
    initFirebase() {
        this.serviceAccount = require(this.gCredPath);
        this.defaultApp = admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: this.dbURL
        });
        this.db = admin.database();
        this.ref = this.db.ref("/warclock/test");
        console.log(this.defaultApp);
    }
    isWarclockRequest(stringToSearch) {
        return stringToSearch.search(this.regexp) >= 0;
    }
    retrieveDB() {
        if (!this.db)
            this.initFirebase();
        this.ref.once("value", function (snapshot) {
            console.log(snapshot.val());
        });
    }
    saveWC() {
        let usersRef = this.ref.child("users");
        usersRef.set({
            alanisawesome: {
                date_of_birth: "June 23, 1912",
                full_name: "Alan Turing"
            },
            gracehop: {
                date_of_birth: "December 9, 1906",
                full_name: "Grace Hopper"
            }
        });
    }
};
WarclockFinder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseURL)),
    __param(1, inversify_1.inject(types_1.TYPES.GoogleAppCred)),
    __metadata("design:paramtypes", [String, String])
], WarclockFinder);
exports.WarclockFinder = WarclockFinder;
//# sourceMappingURL=warclock-finder.js.map