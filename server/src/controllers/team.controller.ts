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
    const { name, description, members } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Team name is required' });
      return;
    }
    
    const teamData = {
      name,
      description,
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
