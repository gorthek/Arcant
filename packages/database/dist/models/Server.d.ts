import { Document, Model } from 'mongoose';
export interface IServer extends Document {
    serverId: string;
    name: string;
    icon?: string;
    ownerId: string;
    isPremium: boolean;
    premiumUntil?: Date;
    joinedAt: Date;
}
export declare const Server: Model<IServer>;
