import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the strict TypeScript Interface for Leads
export interface ILead extends Document {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: mongoose.Types.ObjectId; // Ties the lead to the user who created it
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose Schema
const LeadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      index: true // Optimizes searching by name
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      index: true // Optimizes searching by email
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New'
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: [true, 'Lead source is required']
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true // Automatically handles 'createdAt' and 'updatedAt'
  }
);

// 3. Create a compound index to make advanced filtering blazing fast
LeadSchema.index({ status: 1, source: 1 });

export default mongoose.model<ILead>('Lead', LeadSchema);