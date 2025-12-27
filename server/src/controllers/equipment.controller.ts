import { Request, Response } from 'express';
import * as equipmentService from '../services/equipment.service';
import * as requestService from '../services/request.service';

export const getAllEquipments = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipments = equipmentService.listAllEquipments();
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipments', error });
  }
};

export const createEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipment = equipmentService.createEquipment(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating equipment', error });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const equipment = equipmentService.getEquipmentById(id);
    
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
    const requests = requestService.listRequestsByEquipment(id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment requests', error });
  }
};
