"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
exports.loadCommands = loadCommands;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
exports.commands = new discord_js_1.Collection();
function loadCommands() {
    console.log('[HANDLER] Loading commands...');
    const commandsPath = path_1.default.join(__dirname, '..', 'commands');
    if (!fs_1.default.existsSync(commandsPath)) {
        fs_1.default.mkdirSync(commandsPath, { recursive: true });
        console.log('[HANDLER] Created commands directory.');
        return;
    }
    const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts'));
    for (const file of commandFiles) {
        const filePath = path_1.default.join(commandsPath, file);
        const command = require(filePath).default;
        if (command && command.name) {
            exports.commands.set(command.name, command);
            console.log(`[HANDLER] Loaded command: .${command.name}`);
        }
        else {
            console.warn(`[HANDLER] Failed to load command from ${file}: missing 'name' or 'default' export.`);
        }
    }
}
//# sourceMappingURL=commandHandler.js.map