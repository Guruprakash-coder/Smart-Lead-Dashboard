import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Define the strict TypeScript Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Sales User'; // Mandatory RBAC requirement!
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Define the Mongoose Schema
const UserSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: { 
      type: String, 
      enum: ['Admin', 'Sales User'], 
      default: 'Sales User' 
    },
  },
  { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);

// 3. Modern, Promise-based Pre-save hook (No 'next' required!)
UserSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) {
    return; // Just return to proceed
  }

  // If password was changed, hash it automatically
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 4. Helper method to check passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);