import { inject, injectable } from "inversify";
import * as admin from 'firebase-admin';
import { TYPES } from "../types";

@injectable()
class FirebaseConnection {
    private _db: admin.database.Database 
    private _ref: admin.database.Reference
    private refreshToken;
    private defaultApp;
    private serviceAccount;
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

        this._db = admin.database();
        this._ref = this.db.ref(`warclock/${process.env.SERVER}`);
    }

    get db(): admin.database.Database {
        if (!this._db) this.initFirebase();
        return this._db;
    }

    get ref(): admin.database.Reference {
        if (!this._ref) this.initFirebase();
        return this._ref;
    }
}

export default FirebaseConnection;