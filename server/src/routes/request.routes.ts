import { Router } from 'express';
import * as requestController from '../controllers/request.controller';
import { authenticate, isAdminOrManager, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/requests/calendar?type=Preventive - Must be before /:id routes
router.get('/calendar', requestController.getCalendarRequests);

// GET /api/requests - All authenticated users (filtered by role in controller)
router.get('/', requestController.getAllRequests);

// POST /api/requests - Only Admin and Manager can create
router.post('/', isAdminOrManager, requestController.createRequest);

// PATCH /api/requests/:id/status - Admin, Manager, and assigned Technician
router.patch('/:id/status', authorize('admin', 'manager', 'technician'), requestController.updateRequestStatus);

// PATCH /api/requests/:id/assign - Only Admin and Manager can assign
router.patch('/:id/assign', isAdminOrManager, requestController.assignRequestTechnician);

export default router;
