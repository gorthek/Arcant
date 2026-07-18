import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGlobalSettings extends Document {
  activePromotion: boolean;
  promotionDiscountPercent: number;
  promotionEndDate?: Date;
  promotionMessage?: string;
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>({
  activePromotion: { type: Boolean, default: false },
  promotionDiscountPercent: { type: Number, default: 0 },
  promotionEndDate: { type: Date },
  promotionMessage: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

export const GlobalSettings: Model<IGlobalSettings> = mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
