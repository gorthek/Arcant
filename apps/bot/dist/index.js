"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const commandHandler_1 = require("./handlers/commandHandler");
const eventHandler_1 = require("./handlers/eventHandler");
const database_1 = require("@arcant/database");
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction],
});
// Charger les gestionnaires
(0, commandHandler_1.loadCommands)();
(0, eventHandler_1.loadEvents)(client);
const token = process.env.DISCORD_TOKEN;
if (token) {
    // Connect to DB before logging in
    (0, database_1.dbConnect)().then(() => {
        client.login(token);
    }).catch(err => {
        console.warn('[BOT] MongoDB connection failed. Bot will start anyway, but DB features will be disabled.', err);
        client.login(token);
    });
}
else {
    console.warn('[BOT] No DISCORD_TOKEN provided, skipping login.');
}
// Dummy HTTP server pour Render (Web Service require a port to be bound)
const port = process.env.PORT || 3000;
http_1.default.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is alive!\n');
}).listen(port, () => {
    console.log(`[BOT] Dummy web server is listening on port ${port} (Required by Render)`);
});
//# sourceMappingURL=index.js.map