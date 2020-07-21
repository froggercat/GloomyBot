import { injectable } from "inversify";

@injectable()
export class WCFinder {

    private regexp = /^[\.!\?]{0,1}wc/g;

    public isWarclockRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }
}