import { Request, Response } from 'express';
import { addTeam, teams, MaintenanceTeam } from '../models/team.model';
import { v4 as uuidv4 } from 'uuid';

export const getAllTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTeam: MaintenanceTeam = {
      id: uuidv4(),
      ...req.body
    };
    
    const team = addTeam(newTeam);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error });
  }
};
