import { findEquipmentById, getAllEquipments, addEquipment, Equipment } from '../models/equipment.model';
import { v4 as uuidv4 } from 'uuid';

export const createEquipment = (equipmentData: Omit<Equipment, 'id' | 'isScrapped'>): Equipment => {
  const newEquipment: Equipment = {
    id: uuidv4(),
    ...equipmentData,
    isScrapped: false,
  };
  
  return addEquipment(newEquipment);
};

export const getEquipmentById = (id: string): Equipment | undefined => {
  return findEquipmentById(id);
};

export const listAllEquipments = (): Equipment[] => {
  return getAllEquipments();
};
