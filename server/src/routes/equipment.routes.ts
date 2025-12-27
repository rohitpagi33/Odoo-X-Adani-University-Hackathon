import { Router } from 'express';
import * as equipmentController from '../controllers/equipment.controller';

const router = Router();

// GET /api/equipment
router.get('/', equipmentController.getAllEquipments);

// POST /api/equipment
router.post('/', equipmentController.createEquipment);

// GET /api/equipment/:id
router.get('/:id', equipmentController.getEquipmentById);

// GET /api/equipment/:id/requests
router.get('/:id/requests', equipmentController.getEquipmentRequests);

export default router;
