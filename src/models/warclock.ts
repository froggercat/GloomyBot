import moment from 'moment'

class Warclock {
    public time: number
    public description: string

    public constructor(
        time: any, 
        description: string) {
        this.time = moment(time).unix()
        this.description = description
    }
}

export default Warclock;