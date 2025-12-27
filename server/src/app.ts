import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import equipmentRoutes from './routes/equipment.routes';
import teamRoutes from './routes/team.routes';
import requestRoutes from './routes/request.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'GearGuard API is running',
    version: '1.0.0',
    endpoints: {
      equipment: '/api/equipment',
      teams: '/api/teams',
      requests: '/api/requests'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
