import { inject, injectable } from "inversify";
import WarclockRequest from "../models/warclock-request";


@injectable()
export class WarclockFinder {

    private regexp = /^[\.!\?]{0,1}wc/g;

    public isWarclockRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }

    public parseWarclockRequest(commandToParse: string): WarclockRequest {
        return new WarclockRequest({});
    }
}