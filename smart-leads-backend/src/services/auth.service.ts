import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// Helper to generate JWT Token
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

export const registerUser = async (userData: Partial<IUser>) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Create user
  const user = await User.create(userData);
  
  // Generate token
  const token = generateToken(user._id.toString(), user.role);
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  // Find user by email
  const user = await User.findOne({ email });
  
  // Check if user exists AND password matches
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id.toString(), user.role);
  return { user, token };
};