import { supabaseAdmin } from '../config/supabase';

export interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  department: string;
  assigned_employee?: string;
  purchase_date: string;
  warranty_expiry?: string;
  location: string;
  maintenance_team_id?: string;
  default_technician_id?: string;
  is_scrapped: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Database operations
export const findEquipmentById = async (id: string): Promise<Equipment | null> => {
  const { data, error } = await supabaseAdmin
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching equipment:', error);
    return null;
  }

  return data;
};

export const addEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<Equipment | null> => {
  const { data, error } = await supabaseAdmin
    .from('equipment')
    .insert([equipment])
    .select()
    .single();

  if (error) {
    console.error('Error adding equipment:', error);
    return null;
  }

  return data;
};

export const updateEquipment = async (id: string, updates: Partial<Equipment>): Promise<Equipment | null> => {
  const { data, error } = await supabaseAdmin
    .from('equipment')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating equipment:', error);
    return null;
  }

  return data;
};

export const getAllEquipments = async (): Promise<Equipment[]> => {
  const { data, error } = await supabaseAdmin
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching equipments:', error);
    return [];
  }

  return data || [];
};

export const deleteEquipment = async (id: string): Promise<boolean> => {
  const { error } = await supabaseAdmin
    .from('equipment')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting equipment:', error);
    return false;
  }

  return true;
};

