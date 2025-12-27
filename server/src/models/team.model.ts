import { supabase } from '../config/supabase';

export interface Technician {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  members?: Technician[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  added_by?: string;
  added_at?: string;
}

// Database operations for teams
export const findTeamById = async (id: string): Promise<MaintenanceTeam | null> => {
  const { data, error } = await supabase
    .from('maintenance_teams')
    .select(`
      *,
      team_members (
        user_id,
        users (
          id,
          email,
          full_name,
          avatar_url,
          role
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching team:', error);
    return null;
  }

  // Transform the data to include members array
  const team: MaintenanceTeam = {
    ...data,
    members: data.team_members?.map((tm: any) => tm.users).filter(Boolean) || []
  };

  return team;
};

export const addTeam = async (team: Omit<MaintenanceTeam, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceTeam | null> => {
  const { data, error } = await supabase
    .from('maintenance_teams')
    .insert([{
      name: team.name,
      description: team.description,
      created_by: team.created_by
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding team:', error);
    return null;
  }

  return data;
};

export const getAllTeams = async (): Promise<MaintenanceTeam[]> => {
  const { data, error } = await supabase
    .from('maintenance_teams')
    .select(`
      *,
      team_members (
        user_id,
        users (
          id,
          email,
          full_name,
          avatar_url,
          role
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  // Transform the data to include members array
  return data.map(team => ({
    ...team,
    members: team.team_members?.map((tm: any) => tm.users).filter(Boolean) || []
  }));
};

export const addTeamMember = async (teamId: string, userId: string, addedBy?: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([{
      team_id: teamId,
      user_id: userId,
      added_by: addedBy
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding team member:', error);
    return null;
  }

  return data;
};

export const removeTeamMember = async (teamId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing team member:', error);
    return false;
  }

  return true;
};

// Get all technicians
export const getAllTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, role')
    .eq('role', 'technician')
    .order('full_name');

  if (error) {
    console.error('Error fetching technicians:', error);
    return [];
  }

  return data || [];
};

