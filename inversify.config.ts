import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./src/types";
import { Bot } from "./src/bot";
import { Client } from "discord.js";
import { MessageResponder } from "./src/services/message-responder";
import { PingFinder } from "./src/services/ping-finder" ;
import { ServerFinder } from "./src/services/server-finder";
import { WarclockFinder } from "./src/services/warclock-finder";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();
container.bind<ServerFinder>(TYPES.ServerFinder).to(ServerFinder).inSingletonScope();
container.bind<WarclockFinder>(TYPES.WarclockFinder).to(WarclockFinder).inSingletonScope();
container.bind<string>(TYPES.GoogleAppCred).toConstantValue(process.env.GOOGLE_APPLICATION_CREDENTIALS);
container.bind<string>(TYPES.DatabaseURL).toConstantValue(process.env.DATABASE_URL);

export default container;