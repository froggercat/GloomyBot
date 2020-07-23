import { inject, injectable } from "inversify";
import * as admin from 'firebase-admin';
import { TYPES } from "../types";
import FirebaseConnection from './firebase-connection'
import Warclock from '../models/warclock'

@injectable()
export class WarclockDatabase {
    private connection: FirebaseConnection

    public constructor(
        @inject(TYPES.FirebaseConnection) conn: FirebaseConnection){
        this.connection = conn;
    }

    public clearData(keys: Array<string>, server: string): admin.database.Reference {
        let delRef = this.connection.ref;
        if (server) delRef = delRef.child(server)
        if (keys) {
            keys.forEach(key => {
                delRef.child(key).remove()
            })
        } else {
            delRef.remove();
        }
        return delRef
    }

    public async queryDB(server: string): Promise<object> {
        let queryRef = this.connection.ref;
        if (server) queryRef = queryRef.child(server)
        let results = {};
        await queryRef.once("value")
            .then(function (snapshot) {
                results = { ...results, ...(snapshot.val()) };
            })
            .catch(function (errorObject) {
                console.log("errrrooooorrrr")
                console.error(errorObject);
            });
        return results;
    }

    public async retrieveDB(): Promise<object> {
        let results;
        await this.connection.ref.once("value")
            .then(function (snapshot) {
                results = snapshot.val();
            })
            .catch(function (errorObject) {
                console.error(errorObject);
            });
        return results;
    }

    public saveWC(wc: Warclock, server: string): admin.database.Reference {
        let wcRef = this.connection.ref.child(server);
        wcRef.push().set(wc);
        return wcRef;
    }
}