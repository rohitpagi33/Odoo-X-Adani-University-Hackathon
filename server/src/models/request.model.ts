export type RequestType = "Corrective" | "Preventive";
export type RequestStatus = "New" | "In Progress" | "Repaired" | "Scrap";

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: RequestType;
  equipmentId: string;
  maintenanceTeamId: string;
  technicianId: string;
  scheduledDate: Date;
  duration: number; // in hours
  status: RequestStatus;
  createdAt: Date;
}

// In-memory storage
export const requests: MaintenanceRequest[] = [];

// Helper functions
export const findRequestById = (id: string): MaintenanceRequest | undefined => {
  return requests.find(req => req.id === id);
};

export const addRequest = (request: MaintenanceRequest): MaintenanceRequest => {
  requests.push(request);
  return request;
};

export const updateRequest = (id: string, updates: Partial<MaintenanceRequest>): MaintenanceRequest | undefined => {
  const index = requests.findIndex(req => req.id === id);
  if (index === -1) return undefined;
  
  requests[index] = { ...requests[index], ...updates };
  return requests[index];
};

export const getAllRequests = (): MaintenanceRequest[] => {
  return requests;
};

export const getRequestsByEquipmentId = (equipmentId: string): MaintenanceRequest[] => {
  return requests.filter(req => req.equipmentId === equipmentId);
};

export const getRequestsByType = (type: RequestType): MaintenanceRequest[] => {
  return requests.filter(req => req.type === type);
};
