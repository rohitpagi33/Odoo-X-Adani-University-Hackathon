export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  assignedEmployee?: string;
  purchaseDate: Date;
  warrantyExpiry?: Date;
  location: string;
  maintenanceTeamId: string;
  defaultTechnicianId: string;
  isScrapped: boolean;
}

// In-memory storage
export const equipments: Equipment[] = [];

// Helper functions
export const findEquipmentById = (id: string): Equipment | undefined => {
  return equipments.find(eq => eq.id === id);
};

export const addEquipment = (equipment: Equipment): Equipment => {
  equipments.push(equipment);
  return equipment;
};

export const updateEquipment = (id: string, updates: Partial<Equipment>): Equipment | undefined => {
  const index = equipments.findIndex(eq => eq.id === id);
  if (index === -1) return undefined;
  
  equipments[index] = { ...equipments[index], ...updates };
  return equipments[index];
};

export const getAllEquipments = (): Equipment[] => {
  return equipments;
};
