import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const result = await authService.login({ email, password });

    if (!result) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
};

export const registerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name || !role) {
      res.status(400).json({ message: 'Email, password, full name, and role are required' });
      return;
    }

    // Validate role
    if (!['admin', 'manager', 'technician'].includes(role)) {
      res.status(400).json({ message: 'Invalid role. Must be admin, manager, or technician' });
      return;
    }

    // Check permissions
    if (req.user) {
      // Admin can create any role
      // Manager can only create technicians
      if (req.user.role === 'manager' && role !== 'technician') {
        res.status(403).json({ message: 'Managers can only create technician accounts' });
        return;
      }

      if (req.user.role !== 'admin' && role === 'admin') {
        res.status(403).json({ message: 'Only admins can create admin accounts' });
        return;
      }
    }

    const user = await authService.register(
      { email, password, full_name, role },
      req.user?.id
    );

    if (!user) {
      res.status(400).json({ message: 'User registration failed. Email may already exist.' });
      return;
    }

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

export const getAllUsersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await authService.listAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

export const getUsersByRoleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params;

    if (!['admin', 'manager', 'technician'].includes(role)) {
      res.status(400).json({ message: 'Invalid role parameter' });
      return;
    }

    const users = await authService.listUsersByRole(role as any);
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

export const updateUserController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent role escalation
    if (updates.role && req.user) {
      if (req.user.role === 'manager' && updates.role !== 'technician') {
        res.status(403).json({ message: 'Managers can only update technician roles' });
        return;
      }
    }

    const user = await authService.updateUser(id, updates);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

export const deleteUserController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user?.id === id) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }

    const success = await authService.deleteUser(id);

    if (!success) {
      res.status(404).json({ message: 'User not found or deletion failed' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};

export const getCurrentUserController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Failed to fetch user info', error });
  }
};
