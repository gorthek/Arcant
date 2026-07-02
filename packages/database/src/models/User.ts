import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  discordName?: string;
  email?: string;
  isPremium: boolean;
  premiumUntil?: Date;
  stripeCustomerId?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true },
  discordName: { type: String },
  email: { type: String },
  isPremium: { type: Boolean, default: false },
  premiumUntil: { type: Date },
  stripeCustomerId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Use existing model if already compiled (Next.js hot reload fix)
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
