import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./src/types";
import { Bot } from "./src/bot";
import { Client } from "discord.js";
import { MessageResponder } from "./src/services/message-responder";
import { PingFinder } from "./src/services/ping-finder" ;
import { ServerFinder } from "./src/services/server-finder";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();
container.bind<ServerFinder>(TYPES.ServerFinder).to(ServerFinder).inSingletonScope();

export default container;