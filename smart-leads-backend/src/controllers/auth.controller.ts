import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        token: result.token
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        token: result.token
      }
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};