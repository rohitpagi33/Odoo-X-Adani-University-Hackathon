import { Request, Response } from 'express';
import * as requestService from '../services/request.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters: any = {};
    
    // Filter by user role
    if (req.user) {
      if (req.user.role === 'technician') {
        filters.technicianId = req.user.id;
        filters.role = 'technician';
      } else if (req.user.role === 'manager') {
        filters.managerId = req.user.id;
        filters.role = 'manager';
      }
    }
    
    const requests = await requestService.listAllRequests(filters);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestData = {
      ...req.body,
      created_by: req.user?.id
    };
    
    const request = await requestService.createRequest(requestData);
    
    if (!request) {
      res.status(404).json({ message: 'Equipment not found or request creation failed' });
      return;
    }
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, work_notes, report_url, report_base64, report_filename } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const request = await requestService.updateRequestStatus(id, {
      status,
      work_notes,
      report_url,
      report_base64,
      report_filename,
      userId: req.user.id,
      userRole: req.user.role,
    });
    
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
    
    const request = await requestService.assignRequestTechnician(id, technicianId);
    
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
    
    const requests = await requestService.listRequestsByType(type as any);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar requests', error });
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await requestService.getRequestById(id);
    
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error });
  }
};

export const updateRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const request = await requestService.updateRequestDetails(id, updates);
    
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
  }
};
