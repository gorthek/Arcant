export type TargetProfile = 'SIMPLE_GAMING' | 'COMPLEX_COMMUNITY' | 'DEV_TEAM' | 'STAFF_MODERATION' | 'ESPORT_TEAM' | 'DEFAULT_FALLBACK';
/**
 * Discord API Channel Types simplified for our generator
 */
export declare enum DiscordChannelType {
    GUILD_TEXT = 0,
    GUILD_VOICE = 2,
    GUILD_CATEGORY = 4,
    GUILD_FORUM = 15
}
export interface DiscordRoleData {
    name: string;
    color: number;
    hoist: boolean;
    permissions: string;
}
export interface DiscordChannelData {
    name: string;
    type: DiscordChannelType;
    parentName?: string;
    topic?: string;
}
export interface DiscordGuildTemplate {
    roles: DiscordRoleData[];
    categories: {
        name: string;
    }[];
    channels: DiscordChannelData[];
}
export declare class DiscordGenerator {
    /**
     * Generates a complete Discord Server structure JSON based on the AI's Target Profile.
     */
    static generateForProfile(profile: TargetProfile): DiscordGuildTemplate;
    private static getSimpleGamingTemplate;
    private static getComplexCommunityTemplate;
    private static getDevTeamTemplate;
    private static getStaffModerationTemplate;
    private static getEsportTeamTemplate;
    private static getDefaultTemplate;
}
