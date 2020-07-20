import { injectable } from "inversify";

@injectable()
export class ServerDetailsFinder {

    private regexp = "which server";

    public isServerDetailsRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }
}