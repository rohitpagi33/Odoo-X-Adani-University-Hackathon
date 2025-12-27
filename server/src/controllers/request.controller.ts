import { Request, Response } from 'express';
import * as requestService from '../services/request.service';

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = requestService.listAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

export const createRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = requestService.createRequest(req.body);
    
    if (!request) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const request = requestService.updateRequestStatus(id, status);
    
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }
    
    res.status(200).json(request);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating request status' });
  }
};

export const assignRequestTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    
    const request = requestService.assignRequestTechnician(id, technicianId);
    
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning technician', error });
  }
};

export const getCalendarRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    
    if (!type || (type !== 'Corrective' && type !== 'Preventive')) {
      res.status(400).json({ message: 'Invalid or missing type parameter. Must be "Corrective" or "Preventive"' });
      return;
    }
    
    const requests = requestService.listRequestsByType(type as any);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar requests', error });
  }
};
