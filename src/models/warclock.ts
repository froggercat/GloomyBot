import moment from 'moment'

class Warclock {
    public time: number
    public description: string
    public creator: string

    public constructor(
        time: any, 
        description: string,
        creator: string = "") {
        this.time = moment(time).unix()
        this.description = description
        this.creator = creator
    }
}

export default Warclock;