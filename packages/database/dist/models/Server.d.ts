import { Document, Model } from 'mongoose';
export interface IServer extends Document {
    serverId: string;
    name: string;
    icon?: string;
    ownerId: string;
    isPremium: boolean;
    isLifetimePremium: boolean;
    premiumUntil?: Date;
    joinedAt: Date;
    raidMode: boolean;
    antiLink: boolean;
    antiSpamSensitivity: string;
    logChannelId?: string;
    muteDuration?: string;
    blacklistedWords?: string[];
}
export declare const Server: Model<IServer>;
