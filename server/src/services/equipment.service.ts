import { findEquipmentById, getAllEquipments, addEquipment, updateEquipment as updateEquipmentModel, deleteEquipment as deleteEquipmentModel, Equipment } from '../models/equipment.model';

export const createEquipment = async (equipmentData: Omit<Equipment, 'id' | 'is_scrapped' | 'created_at' | 'updated_at'>): Promise<Equipment | null> => {
  const newEquipment = {
    ...equipmentData,
    is_scrapped: false,
  };
  
  return await addEquipment(newEquipment);
};

export const getEquipmentById = async (id: string): Promise<Equipment | null> => {
  return await findEquipmentById(id);
};

export const listAllEquipments = async (): Promise<Equipment[]> => {
  return await getAllEquipments();
};

export const updateEquipment = async (id: string, updates: Partial<Equipment>): Promise<Equipment | null> => {
  return await updateEquipmentModel(id, updates);
};

export const deleteEquipment = async (id: string): Promise<boolean> => {
  return await deleteEquipmentModel(id);
};

