import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomBot extends Document {
  ownerId: string;
  serverId?: string;
  botName: string;
  botToken: string;
  systemPrompt: string;
  isActive: boolean;
  features: string[]; // ex: ['help', 'moderation']
  createdAt: Date;
  updatedAt: Date;
}

const customBotSchema = new Schema<ICustomBot>(
  {
    ownerId: { type: String, required: true },
    serverId: { type: String, required: false },
    botName: { type: String, required: true },
    botToken: { type: String, required: true },
    systemPrompt: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    features: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

// Pour éviter les soucis de re-compilation de modèle sous Next.js
export const CustomBot = mongoose.models.CustomBot || mongoose.model<ICustomBot>('CustomBot', customBotSchema);
