import { inject, injectable } from "inversify";
import * as admin from 'firebase-admin';
import { TYPES } from "../types";
import Warclock from "../models/warclock";


@injectable()
export class WarclockFinder {

    private regexp = /^[\.!\?]{0,1}wc/g;

    private refreshToken;
    private defaultApp;
    private serviceAccount;
    private db;
    private ref;
    private readonly gCredPath;
    private readonly dbURL;

    public constructor(
        @inject(TYPES.DatabaseURL) dbURL: string,
        @inject(TYPES.GoogleAppCred) gCredPath: string) {
        this.gCredPath = gCredPath;
        this.dbURL = dbURL;
    }

    private initFirebase() {
        this.serviceAccount = require(this.gCredPath);
        this.defaultApp = admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: this.dbURL
        });

        this.db = admin.database();
        this.ref = this.db.ref(`warclock/${process.env.SERVER}`);
    }

    public clearData(data: object, server: string): admin.firestore.CollectionReference {
        if (!this.db) this.initFirebase();

        let delRef = this.ref;
        if (server) delRef = delRef.child(server)
        if (data) {
            Object.keys(data).forEach(key => {
                delRef.child(key).remove()
            })
        } else {
            delRef.remove();
        }
        return delRef
    }

    public isWarclockRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }

    public async retrieveDB(): Promise<object> {
        if (!this.db) this.initFirebase();

        let results;
        await this.ref.once("value")
            .then(function (snapshot) {
                results = snapshot.val();
            })
            .catch(function (errorObject) {
                console.error(errorObject);
            });
        return results;
    }

    public saveWC(wc: Warclock, server: string): admin.firestore.CollectionReference {
        if (!this.db) this.initFirebase();

        let wcRef = this.ref.child(server);
        wcRef.push().set(wc);
        return wcRef;
    }
}