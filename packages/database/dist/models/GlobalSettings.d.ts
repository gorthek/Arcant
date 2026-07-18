import { Document, Model } from 'mongoose';
export interface IGlobalSettings extends Document {
    activePromotion: boolean;
    promotionDiscountPercent: number;
    promotionEndDate?: Date;
    promotionMessage?: string;
    updatedAt: Date;
}
export declare const GlobalSettings: Model<IGlobalSettings>;
