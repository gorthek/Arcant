import mongoose, { Document } from 'mongoose';
export interface IAITemplate extends Document {
    code: string;
    name: string;
    description: string;
    structure: any;
    usageCount: number;
    addedBy: string;
    createdAt: Date;
}
export declare const AITemplate: mongoose.Model<any, {}, {}, {}, any, any>;
