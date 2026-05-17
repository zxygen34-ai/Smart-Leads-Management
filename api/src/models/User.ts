import { Document, Schema, model } from 'mongoose';

export type UserRole = 'admin' | 'sales';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'sales'], default: 'sales' }
  },
  { timestamps: true }
);
export const User = model<UserDocument>('User', userSchema);
