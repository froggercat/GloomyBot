import { inject, injectable } from "inversify";
import * as admin from 'firebase-admin';
import { TYPES } from "../types";
import { FirebaseConnection } from './firebase-connection'
import Warclock from '../models/warclock'

@injectable()
export class WarclockDatabase {
    private connection: FirebaseConnection

    public constructor(
        @inject(TYPES.FirebaseConnection) conn: FirebaseConnection) {
        this.connection = conn;
    }

    public clearData(keys: Array<string>): admin.database.Reference {
        if (keys) {
            keys.forEach(key => {
                this.connection.ref.child(key).remove()
            })
        } else {
            this.connection.ref.remove();
        }
        return this.connection.ref
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
        console.log("current ref path", this.connection.ref.path.valueOf())
        await this.connection.ref.once("value")
            .then(function (snapshot) {
                console.log(snapshot.val())
                results = snapshot.val();
            })
            .catch(function (errorObject) {
                console.error(errorObject);
            });
        return results;
    }

    public saveWC(wc: Warclock, key: string = ""): admin.database.Reference {
        if (!!key) this.connection.ref.child(key).set(wc)
        else this.connection.ref.push(wc)
        return !!key ? this.connection.ref.child(key) : this.connection.ref;
    }

    public set guild(guild: string) {
        this.connection.guild = guild;
    }
    public get guild() {
        return this.connection.guild;
    }
}