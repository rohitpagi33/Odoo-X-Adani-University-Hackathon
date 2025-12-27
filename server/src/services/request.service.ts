import { 
  findRequestById, 
  addRequest, 
  updateRequest as updateRequestModel, 
  getAllRequests,
  getRequestsByEquipmentId,
  getRequestsByType,
  MaintenanceRequest,
  RequestStatus,
  RequestType
} from '../models/request.model';
import { findEquipmentById, updateEquipment } from '../models/equipment.model';

export const createRequest = async (requestData: any): Promise<MaintenanceRequest | null> => {
  // Fetch equipment to validate it exists
  const equipment = await findEquipmentById(requestData.equipment_id);
  
  if (!equipment) {
    return null;
  }
  
  // Parse duration from string to interval format
  let durationInterval = '02:00:00';
  if (requestData.duration) {
    if (typeof requestData.duration === 'string') {
      const match = requestData.duration.match(/([\d.]+)/);
      const hours = match ? parseFloat(match[1]) : 2;
      const mins = (hours % 1) * 60;
      durationInterval = `${String(Math.floor(hours)).padStart(2, '0')}:${String(Math.floor(mins)).padStart(2, '0')}:00`;
    } else {
      const hours = Math.floor(requestData.duration);
      const mins = (requestData.duration % 1) * 60;
      durationInterval = `${String(hours).padStart(2, '0')}:${String(Math.floor(mins)).padStart(2, '0')}:00`;
    }
  }
  
  // Use provided values or fall back to equipment defaults
  const newRequest = {
    description: requestData.description,
    request_type: requestData.request_type || 'maintenance',
    equipment_id: requestData.equipment_id,
    maintenance_team_id: requestData.maintenance_team_id || equipment.maintenance_team_id,
    technician_id: requestData.technician_id || equipment.default_technician_id,
    priority: requestData.priority || 'medium',
    scheduled_date: requestData.scheduled_date || new Date().toISOString(),
    duration: durationInterval,
    created_by: requestData.created_by,
  };
  
  return await addRequest(newRequest);
};

export const updateRequestStatus = async (id: string, status: RequestStatus): Promise<MaintenanceRequest | null> => {
  const request = await findRequestById(id);
  
  if (!request) {
    return null;
  }
  
  // Workflow validation
  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    'pending': ['in_progress', 'cancelled'],
    'in_progress': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };
  
  const allowedStatuses = validTransitions[request.status];
  
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status transition from ${request.status} to ${status}`);
  }
  
  // If moved to completed, update equipment
  if (status === 'completed') {
    await updateEquipment(request.equipment_id, { is_scrapped: false });
  }
  
  return await updateRequestModel(id, { status });
};

export const assignRequestTechnician = async (id: string, technicianId: string): Promise<MaintenanceRequest | null> => {
  return await updateRequestModel(id, { technician_id: technicianId });
};

export const listAllRequests = async (filters?: { 
  technicianId?: string;
  status?: RequestStatus;
  role?: string;
}): Promise<MaintenanceRequest[]> => {
  return await getAllRequests(filters);
};

export const listRequestsByEquipment = async (equipmentId: string): Promise<MaintenanceRequest[]> => {
  return await getRequestsByEquipmentId(equipmentId);
};

export const listRequestsByType = async (type: RequestType): Promise<MaintenanceRequest[]> => {
  return await getRequestsByType(type);
};

export const getOverdueRequests = async (): Promise<MaintenanceRequest[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const allRequests = await getAllRequests();
  return allRequests.filter(req => {
    return req.scheduled_date < today && req.status !== 'Repaired';
  });
};

