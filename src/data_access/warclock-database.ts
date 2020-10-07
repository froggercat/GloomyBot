import { inject, injectable } from "inversify";
import * as admin from 'firebase-admin';
import Warclock from '../models/warclock'
import { DatabaseAccess } from "./database-access";

@injectable()
export class WarclockDatabase extends DatabaseAccess{

    public saveWC(wc: Warclock, key: string = ""): admin.database.Reference {
        if (!!key) this.connection.ref.child(key).set(wc)
        else this.connection.ref.push(wc)
        return !!key ? this.connection.ref.child(key) : this.connection.ref;
    }
}