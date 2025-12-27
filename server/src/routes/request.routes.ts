import { Router } from 'express';
import * as requestController from '../controllers/request.controller';

const router = Router();

// GET /api/requests
router.get('/', requestController.getAllRequests);

// POST /api/requests
router.post('/', requestController.createRequest);

// PATCH /api/requests/:id/status
router.patch('/:id/status', requestController.updateRequestStatus);

// PATCH /api/requests/:id/assign
router.patch('/:id/assign', requestController.assignRequestTechnician);

// GET /api/requests/calendar?type=Preventive
router.get('/calendar', requestController.getCalendarRequests);

export default router;
