import { EmbedBuilder, ColorResolvable } from 'discord.js';

export const ARCANT_COLOR: ColorResolvable = '#1abc9c'; // Teal/Emerald
export const ARCANT_BANNER = 'https://arcant-dashboard.vercel.app/bot-banner.png';
export const ARCANT_FOOTER = 'Arcant • Custom AI Experience';

export function createBaseEmbed(title: string, description: string) {
  return new EmbedBuilder()
    .setColor(ARCANT_COLOR)
    .setTitle(`✧  ${title}  ✧`)
    .setDescription(description)
    .setImage(ARCANT_BANNER)
    .setFooter({ text: ARCANT_FOOTER })
    .setTimestamp();
}

export function createErrorEmbed(description: string) {
  return new EmbedBuilder()
    .setColor('#ff4757')
    .setTitle('⚠️ Erreur')
    .setDescription(description)
    .setFooter({ text: ARCANT_FOOTER })
    .setTimestamp();
}
