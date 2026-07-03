import mongoose, { Schema, Document } from 'mongoose';

export interface IAITemplate extends Document {
  code: string;
  name: string;
  description: string;
  structure: any; // Le JSON retourné par l'API Discord
  usageCount: number;
  addedBy: string; // ID du user qui l'a ajouté
  createdAt: Date;
}

const AITemplateSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  structure: { type: Schema.Types.Mixed, required: true },
  usageCount: { type: Number, default: 0 },
  addedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const AITemplate = mongoose.models.AITemplate || mongoose.model<IAITemplate>('AITemplate', AITemplateSchema);
