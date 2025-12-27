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

export const createRequest = async (requestData: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'maintenance_team_id' | 'technician_id' | 'status'>): Promise<MaintenanceRequest | null> => {
  // Fetch equipment to auto-fill maintenance_team_id and technician_id
  const equipment = await findEquipmentById(requestData.equipment_id);
  
  if (!equipment) {
    return null;
  }
  
  const newRequest = {
    ...requestData,
    maintenance_team_id: equipment.maintenance_team_id,
    technician_id: equipment.default_technician_id,
    status: 'New' as RequestStatus,
  };
  
  return await addRequest(newRequest);
};

export const updateRequestStatus = async (id: string, status: RequestStatus): Promise<MaintenanceRequest | null> => {
  const request = await findRequestById(id);
  
  if (!request) {
    return null;
  }
  
  // Workflow validation: New → In Progress → Repaired
  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    'New': ['In Progress', 'Scrap'],
    'In Progress': ['Repaired', 'Scrap'],
    'Repaired': [],
    'Scrap': []
  };
  
  const allowedStatuses = validTransitions[request.status];
  
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status transition from ${request.status} to ${status}`);
  }
  
  // If moved to Scrap, update equipment
  if (status === 'Scrap') {
    await updateEquipment(request.equipment_id, { is_scrapped: true });
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

