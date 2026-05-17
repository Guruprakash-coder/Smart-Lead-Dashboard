import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// Helper to generate JWT Token
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

export const registerUser = async (userData: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = await User.create(userData);
  const token = generateToken(user._id.toString(), user.role);
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  console.log('\n--- 🕵️ LOGIN ATTEMPT ---');
  console.log(`1. Email typed: "${email}"`);
  console.log(`2. Password typed: "${password}"`);
  
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    console.log('❌ Error: USER NOT FOUND IN MONGODB!');
    throw new Error('Invalid email or password');
  }

  console.log('✅ Success: User found in Database!');
  console.log(`3. DB Password Hash looks like: ${user.password.substring(0, 15)}...`);
  
  // Check if password matches
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    console.log('❌ Error: PASSWORD DOES NOT MATCH THE DATABASE HASH!');
    throw new Error('Invalid email or password');
  }

  console.log('✅ Success: Password matched perfectly! Logging you in...');
  const token = generateToken(user._id.toString(), user.role);
  return { user, token };
};