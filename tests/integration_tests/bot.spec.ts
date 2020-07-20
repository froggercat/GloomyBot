import container from "../../inversify.config";
import {TYPES} from "../../src/types";
// ...

describe('Bot', () => {
  let discordMock: Client;
  let discordInstance: Client;
  let bot: Bot;

  beforeEach(() => {
    discordMock = mock(Client);
    discordInstance = instance(discordMock);
    container.rebind<Client>(TYPES.Client)
      .toConstantValue(discordInstance);
    bot = container.get<Bot>(TYPES.Bot);
  });

  // Test cases here

});