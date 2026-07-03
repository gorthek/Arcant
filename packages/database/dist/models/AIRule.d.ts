import { Document, Model } from 'mongoose';
export interface IAIRule extends Document {
    serverId: string;
    trigger: string;
    response: string;
    intent?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AIRule: Model<IAIRule>;
