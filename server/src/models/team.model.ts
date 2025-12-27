export interface Technician {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  members: Technician[];
}

// In-memory storage
export const teams: MaintenanceTeam[] = [];
export const technicians: Technician[] = [];

// Helper functions
export const findTeamById = (id: string): MaintenanceTeam | undefined => {
  return teams.find(team => team.id === id);
};

export const findTechnicianById = (id: string): Technician | undefined => {
  return technicians.find(tech => tech.id === id);
};

export const addTeam = (team: MaintenanceTeam): MaintenanceTeam => {
  teams.push(team);
  return team;
};

export const addTechnician = (technician: Technician): Technician => {
  technicians.push(technician);
  return technician;
};
