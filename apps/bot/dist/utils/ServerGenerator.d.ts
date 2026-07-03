import { Client } from 'discord.js';
export declare class ServerGenerator {
    static generate(client: Client, serverId: string, prompt: string, template: string, options: {
        createRoles?: boolean;
        managePerms?: boolean;
        customFonts?: boolean;
        customShapes?: boolean;
    }): Promise<void>;
    private static sleep;
}
//# sourceMappingURL=ServerGenerator.d.ts.map