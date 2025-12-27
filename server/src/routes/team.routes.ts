import { Router } from 'express';
import * as teamController from '../controllers/team.controller';

const router = Router();

// GET /api/teams
router.get('/', teamController.getAllTeams);

// POST /api/teams
router.post('/', teamController.createTeam);

export default router;
