import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { authenticate, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/teams/technicians - Must be before /:id to avoid param matching
router.get('/technicians', teamController.getTechniciansController);

// GET /api/teams - All authenticated users can view
router.get('/', teamController.getAllTeams);

// POST /api/teams - Only Admin and Manager can create
router.post('/', isAdminOrManager, teamController.createTeam);

export default router;
