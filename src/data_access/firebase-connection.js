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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseConnection = void 0;
const inversify_1 = require("inversify");
const admin = __importStar(require("firebase-admin"));
const types_1 = require("../types");
let FirebaseConnection = class FirebaseConnection {
    constructor(dbURL, gCredPath) {
        this.gCredPath = gCredPath;
        this.dbURL = dbURL;
    }
    initFirebase() {
        this.serviceAccount = require(this.gCredPath);
        this.defaultApp = admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: this.dbURL
        });
        this.changeDatabase();
    }
    changeDatabase() {
        this._db = admin.database();
        this._ref = this._db.ref(`warclock/${process.env.SERVER}${!!this._guild ? '/' + this._guild : ''}`);
    }
    set guild(guild) {
        this._guild = guild;
        if (!this.db)
            this.initFirebase();
        else
            this.changeDatabase();
    }
    get guild() {
        return this._guild;
    }
    get db() {
        if (!this._db)
            this.initFirebase();
        return this._db;
    }
    get ref() {
        if (!this._ref)
            this.initFirebase();
        return this._ref;
    }
};
FirebaseConnection = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseURL)),
    __param(1, inversify_1.inject(types_1.TYPES.GoogleAppCred)),
    __metadata("design:paramtypes", [String, String])
], FirebaseConnection);
exports.FirebaseConnection = FirebaseConnection;
//# sourceMappingURL=firebase-connection.js.map