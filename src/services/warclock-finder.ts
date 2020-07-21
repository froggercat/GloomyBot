import { inject, injectable } from "inversify";
import * as admin from 'firebase-admin';
import { TYPES } from "../types";

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
        this.ref = this.db.ref("/warclock/test");

        console.log(this.defaultApp);
    }

    public isWarclockRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }

    public retrieveDB() {
        if (!this.db) this.initFirebase();

        this.ref.once("value", function (snapshot) {
            console.log(snapshot.val());
        });
    }

    public saveWC() {
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
}