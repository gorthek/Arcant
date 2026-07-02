import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServer extends Document {
  serverId: string;
  name: string;
  ownerId: string;
  isPremium: boolean;
  premiumUntil?: Date;
  joinedAt: Date;
}

const ServerSchema = new Schema<IServer>({
  serverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ownerId: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  premiumUntil: { type: Date },
  joinedAt: { type: Date, default: Date.now }
});

// Use existing model if already compiled (Next.js hot reload fix)
export const Server: Model<IServer> = mongoose.models.Server || mongoose.model<IServer>('Server', ServerSchema);
