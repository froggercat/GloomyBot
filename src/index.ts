require('dotenv').config(); // Recommended way of loading dotenv
import container from "../inversify.config";
import { TYPES } from "./types";
import { Bot } from "./bot";
let bot = container.get<Bot>(TYPES.Bot);
bot.listen().then(() => {
    console.log('Logged in! Initializing stuff ...')
    // bot.init();
    console.log("K initialization complete")
}).catch((error) => {
    console.log('Oh no! ', error)
});