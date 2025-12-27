import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

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

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Fetch user role from public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role, full_name')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Attach user info to request
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
