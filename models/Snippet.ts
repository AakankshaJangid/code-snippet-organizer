import mongoose, { Schema, Document } from "mongoose";

export interface ISnippet extends Document {
  userId: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  code: string;
  embedding: number[];
}

const SnippetSchema = new Schema<ISnippet>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  language: String,
  tags: [String],
  code: { type: String, required: true },
  embedding: { type: [Number], default: [] },
}, { timestamps: true });

export default mongoose.models.Snippet || mongoose.model<ISnippet>("Snippet", SnippetSchema);