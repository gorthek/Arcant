import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIRule extends Document {
  serverId: string;
  trigger: string; // The keyword or pattern to match (e.g. "bonjour")
  response: string; // The response message with variables
  intent?: string; // Optional intent label (e.g. "greeting", "moderation")
  createdAt: Date;
  updatedAt: Date;
}

const AIRuleSchema = new Schema<IAIRule>(
  {
    serverId: { type: String, required: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true },
    intent: { type: String, default: 'general' }
  },
  {
    timestamps: true
  }
);

// Compound index to speed up checks and avoid duplicate triggers per server
AIRuleSchema.index({ serverId: 1, trigger: 1 }, { unique: true });

export const AIRule: Model<IAIRule> = mongoose.models.AIRule || mongoose.model<IAIRule>('AIRule', AIRuleSchema);
