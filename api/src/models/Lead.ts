import { Document, Schema, model } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface LeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<LeadDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Qualified', 'Lost']
    },
    source: {
      type: String,
      required: true,
      enum: ['Website', 'Instagram', 'Referral']
    }
  },
  { timestamps: true }
);

leadSchema.index({ name: 1 });
leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = model<LeadDocument>('Lead', leadSchema);
