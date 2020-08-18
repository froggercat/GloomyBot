import WarclockCommand from "../models/warclock-commands";

let help_help = `dis command creates a clock to track how much time has passed since a particular event.
    Unlike my ub3r competitor over there, you can set the start time to whatever you want.
    Lmk if you need help with a specific command by tacking \`help\` onto the end of whatever.
    Btw \`#id\` means type in the id. Run \`wc list\` to check your id's first.
        
Usage: \`wc #id\` \`wc list\` \`wc start <text>\` \`wc #id stop\` \`wc #id reset\` \`wc #id set <time|description> <value>\`
    FYI I will also respond to \`.wc\`, \`!wc\` and \`?wc\` instead of \`wc\`.`

let id_help = `so basically, you put in the id number to retrive a single clock. Like: \`wc 0\` is gonna get your first clock. 
    You can also do \`wc #0\`, I gotchu
    This id format also applies to commands that use an id, like set.`
let id_err = `that's not a valid clock id, run \`wc list\` to get clocks. Sometimes I change the id's on you ;)`

let list_help = `honestly you should just run \`wc list\` instead of asking me about it. If you got clocks I'll give 'em to you.`
let list_err = `Sorry something went wrong, I told my human tho`

let reset_help = `this allows you to reset your clock's timer to right now. You gotta give me an id though, like \`wc 0 reset\`. Yes, I know the formatting's different than ub3r, gotta keep you on your toes.`

let set_help = `ooh, so you're interested in the thing I do dat ub3r don't. Well, sometimes you want to edit a clock. You can change either the time or the description, but not both. For example:
    \`wc 0 set time 2020-01-01\` is gonna change the start time of your #0 clock to be 2020-01-01. I handle most ways of writing a date in English, including some fun ways like "5 hours ago".
    \`wc 0 set description something new\` will change the clock's name to "something new". Caveat, your clock names can't end with "help" because then I will think you need help messages like these. (wrap it with some formatting like \\\`help\\\` if you reaaaaally want to use it)
    You cannot do something like \`wc set time tomorrow set description hi\` cuz dats too many settings at once ... I mean, I won't stop you, but I can't promise things will end well for you.`

let start_help = `this just creates a new clock starting right now with the description you give it. Like:
    \`wc start a clock thing\` will create a clock ticking up from now called "start a clock thing".`

let stop_help = `this is honestly a delete command, it will stop the clock of your choosing. Use it like:
    \`wc 0 stop\` to stop your clock with id 0.`

let default_help = `ngl you really shouldn't be able to see this message .... er, hi? You should probably run \`wc help\`.`

let abject_fail_help = `you want clock stuff amirite`

let help = {}
help[WarclockCommand.id] = id_help
help[WarclockCommand.help] = help_help
help[WarclockCommand.list] = list_help
help[WarclockCommand.reset] = reset_help
help[WarclockCommand.set] = set_help
help[WarclockCommand.start] = start_help
help[WarclockCommand.stop] = stop_help
help['default'] = default_help
help['failure'] = abject_fail_help

let error = {}
error[WarclockCommand.id] = id_err
error[WarclockCommand.help] = ""
error[WarclockCommand.list] = list_err
error[WarclockCommand.reset] = ""
error[WarclockCommand.set] = ""
error[WarclockCommand.start] = ""
error[WarclockCommand.stop] = ""
error['default'] = ""
error['failure'] = ""


let cmd_keys = [
    ...Object.keys(WarclockCommand).filter(key => !isNaN(Number(WarclockCommand[key]))).map(key => WarclockCommand[key]),
    ...['default', 'failure']
]

export default [
    ...cmd_keys.map(cmd => {
        return {
            cmd: cmd,
            help: help[cmd],
            error: error[cmd]
        }
    }),
]