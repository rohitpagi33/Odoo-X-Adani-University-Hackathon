import { Request, Response } from 'express';
import * as equipmentService from '../services/equipment.service';
import * as requestService from '../services/request.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllEquipments = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipments = await equipmentService.listAllEquipments();
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipments', error });
  }
};

export const createEquipment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const equipmentData = {
      ...req.body,
      created_by: req.user?.id
    };
    
    const equipment = await equipmentService.createEquipment(equipmentData);
    
    if (!equipment) {
      res.status(400).json({ message: 'Failed to create equipment' });
      return;
    }
    
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating equipment', error });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const equipment = await equipmentService.getEquipmentById(id);
    
    if (!equipment) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }
    
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment', error });
  }
};

export const getEquipmentRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requests = await requestService.listRequestsByEquipment(id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment requests', error });
  }
};

export const updateEquipmentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const equipment = await equipmentService.updateEquipment(id, updates);
    
    if (!equipment) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }
    
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating equipment', error });
  }
};
