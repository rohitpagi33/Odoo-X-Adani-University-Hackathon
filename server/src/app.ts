import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import equipmentRoutes from './routes/equipment.routes';
import teamRoutes from './routes/team.routes';
import requestRoutes from './routes/request.routes';

const app: Application = express();

// Middleware
app.use(cors());
// Allow larger payloads for PDF uploads attached to status updates
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'GearGuard API is running',
    version: '2.0.0',
    database: 'Supabase PostgreSQL',
    authentication: 'Enabled',
    endpoints: {
      auth: '/api/auth',
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
