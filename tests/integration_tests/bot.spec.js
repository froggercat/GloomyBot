"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../inversify.config");
const types_1 = require("../../src/types");
// ...
describe('Bot', () => {
    let discordMock;
    let discordInstance;
    let bot;
    beforeEach(() => {
        discordMock = mock(Client);
        discordInstance = instance(discordMock);
        inversify_config_1.default.rebind(types_1.TYPES.Client)
            .toConstantValue(discordInstance);
        bot = inversify_config_1.default.get(types_1.TYPES.Bot);
    });
    // Test cases here
});
//# sourceMappingURL=bot.spec.js.map