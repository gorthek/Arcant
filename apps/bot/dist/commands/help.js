"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const embed_1 = require("../utils/embed");
const HelpCommand = {
    name: 'help',
    description: 'Affiche le menu d\'aide avec style.',
    aliases: ['h', 'aide'],
    async execute(message, args) {
        // Construction de l'embed ultra stylisé
        const embed = (0, embed_1.createBaseEmbed)('CENTRE DE COMMANDES ARCANT', 'Bienvenue dans le terminal Arcant.\nVoici les modules actuellement à votre disposition.')
            .addFields({
            name: '🤖  |  **` .help `**',
            value: 'Affiche ce menu d\'aide interactif.',
            inline: false,
        }, {
            name: '📜  |  **` .patchnote `**',
            value: '*(Bientôt)* Affiche les dernières nouveautés du projet.',
            inline: false,
        }, {
            name: '🌐  |  **Dashboard Web**',
            value: '[Accéder au Panel Vercel](https://arcant-dashboard.vercel.app/)',
            inline: false,
        })
            .setThumbnail('https://arcant-dashboard.vercel.app/logo.png') // On utilise le logo qui est déjà sur Vercel
            .setImage('https://arcant-dashboard.vercel.app/bot-banner.png'); // La bannière générée spécialement pour ça
        await message.reply({ embeds: [embed] });
    },
};
exports.default = HelpCommand;
//# sourceMappingURL=help.js.map