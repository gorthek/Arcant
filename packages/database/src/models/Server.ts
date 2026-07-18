import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServer extends Document {
  serverId: string;
  name: string;
  icon?: string;
  ownerId: string;
  isPremium: boolean;
  isLifetimePremium: boolean;
  premiumUntil?: Date;
  joinedAt: Date;
  // Security settings
  raidMode: boolean;
  antiLink: boolean;
  antiSpamSensitivity: string;
  // Moderation settings
  logChannelId?: string;
  muteDuration?: string;
  blacklistedWords?: string[];
}

const ServerSchema = new Schema<IServer>({
  serverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String },
  ownerId: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  isLifetimePremium: { type: Boolean, default: false },
  premiumUntil: { type: Date },
  joinedAt: { type: Date, default: Date.now },
  // Security defaults
  raidMode: { type: Boolean, default: false },
  antiLink: { type: Boolean, default: true },
  antiSpamSensitivity: { type: String, default: 'medium' },
  // Moderation defaults
  logChannelId: { type: String, default: '' },
  muteDuration: { type: String, default: '10m' },
  blacklistedWords: { type: [String], default: [] }
});

// Use existing model if already compiled (Next.js hot reload fix)
export const Server: Model<IServer> = mongoose.models.Server || mongoose.model<IServer>('Server', ServerSchema);
