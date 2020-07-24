import { injectable } from "inversify";
import WarclockRequest from "../models/warclock-request";


@injectable()
export class WarclockFinder {

    private regexp = /^[\.!\?]{0,1}wc/g;
    private parser_regexp = /^\S+\s+([0-9]*)\s*(list|set|start|stop|set|reset)?\s*(.*)/gm;
    private help_regexp = /help$/gm;

    public isWarclockRequest(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }

    public parseWarclockRequest(commandToParse: string): WarclockRequest {
        let match, params = {}
        while (match = this.parser_regexp.exec(commandToParse)) {
            if (!!match[1]) {
                console.log("ID argument found")
                params["id"] = match[1]
                params["command"] = ["id"]
            }
            if (!!match[2]) {
                console.log("Command argument found")
                params["command"] = [match[2]]
            }
            if (!!match[4]) {
                console.log("Secondary Command argument found")
                params["command"].push(match[4])
                params["time"] = match[3]
            } else {
                console.log(`Description found: '${match[3]}'`)
                // console.log(match)
                params["description"] = match[3]
            }
        }
        while (match = this.help_regexp.exec(commandToParse)) {
            console.log("User needs help")
            if (!!params["command"]) params["command"].push("help")
            else params["command"] = ["help"]
        }
        let result = new WarclockRequest(params);
        console.log(result);
        return result;
    }
}
