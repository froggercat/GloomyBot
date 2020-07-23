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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarclockFinder = void 0;
const inversify_1 = require("inversify");
const admin = __importStar(require("firebase-admin"));
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
        this.ref = this.db.ref(`warclock/${process.env.SERVER}`);
    }
    clearData(keys, server) {
        if (!this.db)
            this.initFirebase();
        let delRef = this.ref;
        if (server)
            delRef = delRef.child(server);
        if (keys) {
            keys.forEach(key => {
                delRef.child(key).remove();
            });
        }
        else {
            delRef.remove();
        }
        return delRef;
    }
    queryDB(server) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                this.initFirebase();
            let queryRef = this.ref;
            if (server)
                queryRef = queryRef.child(server);
            let results = {};
            yield queryRef.once("value")
                .then(function (snapshot) {
                results = Object.assign(Object.assign({}, results), (snapshot.val()));
            })
                .catch(function (errorObject) {
                console.log("errrrooooorrrr");
                console.error(errorObject);
            });
            return results;
        });
    }
    isWarclockRequest(stringToSearch) {
        return stringToSearch.search(this.regexp) >= 0;
    }
    retrieveDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                this.initFirebase();
            let results;
            yield this.ref.once("value")
                .then(function (snapshot) {
                results = snapshot.val();
            })
                .catch(function (errorObject) {
                console.error(errorObject);
            });
            return results;
        });
    }
    saveWC(wc, server) {
        if (!this.db)
            this.initFirebase();
        let wcRef = this.ref.child(server);
        wcRef.push().set(wc);
        return wcRef;
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