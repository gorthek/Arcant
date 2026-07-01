"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEvents = loadEvents;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function loadEvents(client) {
    console.log('[HANDLER] Loading events...');
    const eventsPath = path_1.default.join(__dirname, '..', 'events');
    if (!fs_1.default.existsSync(eventsPath)) {
        fs_1.default.mkdirSync(eventsPath, { recursive: true });
        console.log('[HANDLER] Created events directory.');
        return;
    }
    const eventFiles = fs_1.default.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path_1.default.join(eventsPath, file);
        const event = require(filePath).default;
        if (event && event.name) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`[HANDLER] Loaded event: ${event.name}`);
        }
        else {
            console.warn(`[HANDLER] Failed to load event from ${file}.`);
        }
    }
}
//# sourceMappingURL=eventHandler.js.map