import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

// Create transporter helper: prefers explicit SMTP host/port, then MAIL_SERVICE, then Ethereal for dev
const createTransporter = async () => {
  // Prefer explicit SMTP host/port configuration
  if (process.env.MAIL_HOST && process.env.MAIL_PORT) {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true', // true for port 465
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Use well-known service if provided (gmail, outlook, etc.)
  if (process.env.MAIL_SERVICE && process.env.MAIL_FROM && process.env.MAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Fallback for local development: create an Ethereal test account
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Using Ethereal test account for email (development).');
    return testTransporter;
  }

  // As a last resort, attempt default transport (may try localhost:587)
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'localhost',
    port: Number(process.env.MAIL_PORT || 587),
  });
};

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

export const forgotPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    // Check if user exists
    const user = await authService.getUserByEmail(email);
    
    if (!user) {
      // Don't reveal if email exists for security
      res.status(200).json({ message: 'If email exists, reset link will be sent' });
      return;
    }

    // Generate reset token (in real app, save this to DB with expiry)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@gearguard.com',
      to: email,
      subject: 'GearGuard - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔧 GearGuard</h1>
            <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 14px;">Maintenance Management System</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #475569; line-height: 1.6;">
              We received a request to reset the password for your GearGuard account. Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px;">
              Or copy this link: <br>
              <code style="background: #e2e8f0; padding: 8px; word-break: break-all; display: block; margin-top: 10px;">${resetLink}</code>
            </p>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
              This link will expire in 1 hour. If you didn't request this, ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #94a3b8; font-size: 12px;">
              © 2024 GearGuard. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);

    // If we used Ethereal (test) transport, log the preview URL
    try {
      const preview = nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info);
      if (preview) console.log('Password reset email preview URL:', preview);
    } catch (e) {
      // ignore
    }

    console.log(`Password reset email sent to ${email}`);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset', error });
  }
};

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword, token } = req.body;

    if (!email || !newPassword || !token) {
      res.status(400).json({ message: 'Email, new password, and token are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    // Check if user exists
    const user = await authService.getUserByEmail(email);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    const updatedUser = await authService.updateUserPassword(user.id, hashedPassword);

    if (!updatedUser) {
      res.status(500).json({ message: 'Failed to update password' });
      return;
    }

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password', error });
  }
};
