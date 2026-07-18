import mongoose, { Document } from 'mongoose';
export interface ICustomBot extends Document {
    ownerId: string;
    serverId?: string;
    botName: string;
    botToken: string;
    systemPrompt: string;
    isActive: boolean;
    features: string[];
    creationMethod: 'code' | 'scratch' | 'ai';
    rawCode?: string;
    scratchGraph?: any;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CustomBot: mongoose.Model<any, {}, {}, {}, any, any>;
