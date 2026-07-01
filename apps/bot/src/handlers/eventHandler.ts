import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';

export function loadEvents(client: Client) {
  console.log('[HANDLER] Loading events...');
  
  const eventsPath = path.join(__dirname, '..', 'events');
  
  if (!fs.existsSync(eventsPath)) {
    fs.mkdirSync(eventsPath, { recursive: true });
    console.log('[HANDLER] Created events directory.');
    return;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath).default;
    
    if (event && event.name) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      console.log(`[HANDLER] Loaded event: ${event.name}`);
    } else {
      console.warn(`[HANDLER] Failed to load event from ${file}.`);
    }
  }
}
