import { Router } from 'express';
import * as equipmentController from '../controllers/equipment.controller';
import { authenticate, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/equipment - All authenticated users can view
router.get('/', equipmentController.getAllEquipments);

// POST /api/equipment - Only Admin and Manager can create
router.post('/', isAdminOrManager, equipmentController.createEquipment);

// GET /api/equipment/:id - All authenticated users can view
router.get('/:id', equipmentController.getEquipmentById);

// PATCH /api/equipment/:id - Only Admin and Manager can update
router.patch('/:id', isAdminOrManager, equipmentController.updateEquipmentController);

// GET /api/equipment/:id/requests - All authenticated users can view
router.get('/:id/requests', equipmentController.getEquipmentRequests);

export default router;
