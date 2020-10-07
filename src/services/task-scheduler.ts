import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { WarclockScheduler } from "./warclock-scheduler";

@injectable()
export class TaskScheduler {
    private wcScheduler: WarclockScheduler;
    constructor(
        @inject(TYPES.WarclockScheduler) wcScheduler: WarclockScheduler
    ) {
        this.wcScheduler = wcScheduler;
    }

    public async init(): Promise<Object> {
        return this.wcScheduler.scheduleReminders()
            .then(status => {
                console.log("ok we finished scheduling reminders", status)
                return {"WarclockReminders": status}
            })
    }
}