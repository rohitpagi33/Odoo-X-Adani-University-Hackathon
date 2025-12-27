import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, isAdmin, isAdminOrManager, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', authController.loginController);

// Protected routes - require authentication
router.get('/me', authenticate, authController.getCurrentUserController);

// Admin and Manager can register new users
router.post('/register', authenticate, isAdminOrManager, authController.registerController);

// Admin and Manager can view all users
router.get('/users', authenticate, isAdminOrManager, authController.getAllUsersController);

// Get users by role
router.get('/users/role/:role', authenticate, isAdminOrManager, authController.getUsersByRoleController);

// Admin and Manager can update users
router.patch('/users/:id', authenticate, isAdminOrManager, authController.updateUserController);

// Only Admin can delete users
router.delete('/users/:id', authenticate, isAdmin, authController.deleteUserController);

export default router;
