import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { authenticate, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/teams - All authenticated users can view
router.get('/', teamController.getAllTeams);

// POST /api/teams - Only Admin and Manager can create
router.post('/', isAdminOrManager, teamController.createTeam);

// GET /api/teams/technicians - All authenticated users can view technicians
router.get('/technicians', teamController.getTechniciansController);

export default router;
