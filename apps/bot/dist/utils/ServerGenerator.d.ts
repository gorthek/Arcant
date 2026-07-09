import { Client } from 'discord.js';
export declare class ServerGenerator {
    static generatePreview(client: Client, prompt: string, templateUrl: string, // Lien éventuel discord.new
    options: {
        createRoles?: boolean;
        managePerms?: boolean;
    }): Promise<any>;
    static applyStructure(client: Client, serverId: string, structure: any, options: {
        createRoles?: boolean;
        managePerms?: boolean;
        clearExisting?: boolean;
    }): Promise<{
        success: boolean;
    }>;
    static readServerStructure(client: Client, serverId: string): Promise<{
        roles: {
            id: string;
            name: string;
            color: `#${string}`;
        }[];
        categories: {
            id: string;
            name: string;
            channels: {
                id: string;
                name: string;
                type: string;
            }[];
        }[];
    }>;
    private static parsePermissions;
    private static sleep;
}
//# sourceMappingURL=ServerGenerator.d.ts.map