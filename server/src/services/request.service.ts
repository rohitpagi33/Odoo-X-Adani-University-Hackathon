import { 
  findRequestById, 
  addRequest, 
  updateRequest, 
  getAllRequests,
  getRequestsByEquipmentId,
  getRequestsByType,
  MaintenanceRequest,
  RequestStatus,
  RequestType
} from '../models/request.model';
import { findEquipmentById, updateEquipment } from '../models/equipment.model';
import { v4 as uuidv4 } from 'uuid';

export const createRequest = (requestData: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'maintenanceTeamId' | 'technicianId'>): MaintenanceRequest | null => {
  // Fetch equipment to auto-fill maintenanceTeamId and technicianId
  const equipment = findEquipmentById(requestData.equipmentId);
  
  if (!equipment) {
    return null;
  }
  
  const newRequest: MaintenanceRequest = {
    id: uuidv4(),
    ...requestData,
    maintenanceTeamId: equipment.maintenanceTeamId,
    technicianId: equipment.defaultTechnicianId,
    status: 'New',
    createdAt: new Date(),
  };
  
  return addRequest(newRequest);
};

export const updateRequestStatus = (id: string, status: RequestStatus): MaintenanceRequest | null => {
  const request = findRequestById(id);
  
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
    updateEquipment(request.equipmentId, { isScrapped: true });
  }
  
  return updateRequest(id, { status });
};

export const assignRequestTechnician = (id: string, technicianId: string): MaintenanceRequest | null => {
  return updateRequest(id, { technicianId });
};

export const listAllRequests = (): MaintenanceRequest[] => {
  return getAllRequests();
};

export const listRequestsByEquipment = (equipmentId: string): MaintenanceRequest[] => {
  return getRequestsByEquipmentId(equipmentId);
};

export const listRequestsByType = (type: RequestType): MaintenanceRequest[] => {
  return getRequestsByType(type);
};

export const getOverdueRequests = (): MaintenanceRequest[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return getAllRequests().filter(req => {
    const scheduledDate = new Date(req.scheduledDate);
    scheduledDate.setHours(0, 0, 0, 0);
    return scheduledDate < today && req.status !== 'Repaired';
  });
};
