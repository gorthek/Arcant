"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARCANT_FOOTER = exports.ARCANT_BANNER = exports.ARCANT_COLOR = void 0;
exports.createBaseEmbed = createBaseEmbed;
exports.createErrorEmbed = createErrorEmbed;
const discord_js_1 = require("discord.js");
exports.ARCANT_COLOR = '#1abc9c'; // Teal/Emerald
exports.ARCANT_BANNER = 'https://arcant-dashboard.vercel.app/bot-banner.png';
exports.ARCANT_FOOTER = 'Arcant • Custom AI Experience';
function createBaseEmbed(title, description) {
    return new discord_js_1.EmbedBuilder()
        .setColor(exports.ARCANT_COLOR)
        .setTitle(`✧  ${title}  ✧`)
        .setDescription(description)
        .setImage(exports.ARCANT_BANNER)
        .setFooter({ text: exports.ARCANT_FOOTER })
        .setTimestamp();
}
function createErrorEmbed(description) {
    return new discord_js_1.EmbedBuilder()
        .setColor('#ff4757')
        .setTitle('⚠️ Erreur')
        .setDescription(description)
        .setFooter({ text: exports.ARCANT_FOOTER })
        .setTimestamp();
}
//# sourceMappingURL=embed.js.map