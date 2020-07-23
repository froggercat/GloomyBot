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
const inversify_1 = require("inversify");
const types_1 = require("../types");
const firebase_connection_1 = __importDefault(require("./firebase-connection"));
let WarclockDatabase = class WarclockDatabase {
    constructor(conn) {
        this.connection = conn;
    }
    clearData(keys, server) {
        let delRef = this.connection.ref;
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
            let queryRef = this.connection.ref;
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
    retrieveDB() {
        return __awaiter(this, void 0, void 0, function* () {
            let results;
            yield this.connection.ref.once("value")
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
        let wcRef = this.connection.ref.child(server);
        wcRef.push().set(wc);
        return wcRef;
    }
};
WarclockDatabase = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.FirebaseConnection)),
    __metadata("design:paramtypes", [firebase_connection_1.default])
], WarclockDatabase);
//# sourceMappingURL=warclock-db.js.map