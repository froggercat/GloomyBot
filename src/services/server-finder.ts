import { injectable } from "inversify";

@injectable()
export class ServerFinder {

    private regexp = "which server";

    public isServerRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }
}