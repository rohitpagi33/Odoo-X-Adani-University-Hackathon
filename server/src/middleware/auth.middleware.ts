import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'technician';
  };
}

/**
 * Middleware to verify JWT token from Supabase
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET missing');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const userId = decoded?.sub as string;
    if (!userId) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, role, full_name')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      id: userData.id,
      email: userData.email,
      role: userData.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has required role
 */
export const authorize = (...allowedRoles: ('admin' | 'manager' | 'technician')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = authorize('admin');

/**
 * Middleware to check if user is admin or manager
 */
export const isAdminOrManager = authorize('admin', 'manager');

/**
 * Middleware for all authenticated users
 */
export const isAuthenticated = authenticate;
