import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    discordId: string;
    discordName?: string;
    email?: string;
    isPremium: boolean;
    premiumUntil?: Date;
    stripeCustomerId?: string;
    createdAt: Date;
}
export declare const User: Model<IUser>;
