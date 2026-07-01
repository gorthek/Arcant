import fs from 'fs';
import path from 'path';
import { Collection, Client } from 'discord.js';
import { Command } from '../types/Command';

export const commands = new Collection<string, Command>();

export function loadCommands() {
  console.log('[HANDLER] Loading commands...');
  
  const commandsPath = path.join(__dirname, '..', 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath, { recursive: true });
    console.log('[HANDLER] Created commands directory.');
    return;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Command = require(filePath).default;
    
    if (command && command.name) {
      commands.set(command.name, command);
      console.log(`[HANDLER] Loaded command: .${command.name}`);
    } else {
      console.warn(`[HANDLER] Failed to load command from ${file}: missing 'name' or 'default' export.`);
    }
  }
}
