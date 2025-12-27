import { supabase } from '../config/supabase';

export type RequestType = "Corrective" | "Preventive";
export type RequestStatus = "New" | "In Progress" | "Repaired" | "Scrap";

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  equipment_id: string;
  maintenance_team_id?: string;
  technician_id?: string;
  scheduled_date: string;
  duration: number; // in hours
  status: RequestStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Database operations
export const findRequestById = async (id: string): Promise<MaintenanceRequest | null> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching request:', error);
    return null;
  }

  return data;
};

export const addRequest = async (request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceRequest | null> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert([request])
    .select()
    .single();

  if (error) {
    console.error('Error adding request:', error);
    return null;
  }

  return data;
};

export const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | null> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating request:', error);
    return null;
  }

  return data;
};

export const getAllRequests = async (filters?: { 
  technicianId?: string;
  status?: RequestStatus;
  role?: string;
}): Promise<MaintenanceRequest[]> => {
  let query = supabase
    .from('maintenance_requests')
    .select('*')
    .order('created_at', { ascending: false });

  // If technician, only show their assigned requests
  if (filters?.role === 'technician' && filters?.technicianId) {
    query = query.eq('technician_id', filters.technicianId);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching requests:', error);
    return [];
  }

  return data || [];
};

export const getRequestsByEquipmentId = async (equipmentId: string): Promise<MaintenanceRequest[]> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching requests by equipment:', error);
    return [];
  }

  return data || [];
};

export const getRequestsByType = async (type: RequestType): Promise<MaintenanceRequest[]> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .eq('type', type)
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching requests by type:', error);
    return [];
  }

  return data || [];
};

export const deleteRequest = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('maintenance_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting request:', error);
    return false;
  }

  return true;
};

