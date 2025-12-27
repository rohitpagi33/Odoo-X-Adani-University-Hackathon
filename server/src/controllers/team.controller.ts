import { Request, Response } from 'express';
import { addTeam, getAllTeams as getTeamsModel, addTeamMember, getAllTechnicians } from '../models/team.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await getTeamsModel();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
};

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, members, manager_id } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Team name is required' });
      return;
    }
    
    const teamData = {
      name,
      description,
      manager_id,
      created_by: req.user?.id
    };
    
    const team = await addTeam(teamData);
    
    if (!team) {
      res.status(400).json({ message: 'Failed to create team' });
      return;
    }
    
    // Add team members if provided
    if (members && Array.isArray(members) && members.length > 0) {
      for (const memberId of members) {
        await addTeamMember(team.id, memberId, req.user?.id);
      }
    }
    
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error });
  }
};

export const getTechniciansController = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicians = await getAllTechnicians();
    res.status(200).json(technicians);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching technicians', error });
  }
};

export const getManagersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { getAllManagers } = await import('../models/team.model');
    const managers = await getAllManagers();
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers', error });
  }
};

export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { findTeamById } = await import('../models/team.model');
    const team = await findTeamById(id);
    
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team', error });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, manager_id, members } = req.body;
    
    const { updateTeam: updateTeamModel, removeTeamMembers, addTeamMember } = await import('../models/team.model');
    
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (manager_id !== undefined) updates.manager_id = manager_id;
    
    const team = await updateTeamModel(id, updates);
    
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    // Update team members if provided
    if (members && Array.isArray(members)) {
      // Remove all existing members
      await removeTeamMembers(id);
      
      // Add new members
      for (const memberId of members) {
        await addTeamMember(id, memberId, req.user?.id);
      }
    }
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team', error });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { deleteTeam: deleteTeamModel } = await import('../models/team.model');
    const success = await deleteTeamModel(id);
    
    if (!success) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error });
  }
};
