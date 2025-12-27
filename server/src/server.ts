import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GearGuard Server is running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - GET    /api/equipment`);
  console.log(`  - POST   /api/equipment`);
  console.log(`  - GET    /api/equipment/:id`);
  console.log(`  - GET    /api/equipment/:id/requests`);
  console.log(`  - GET    /api/teams`);
  console.log(`  - POST   /api/teams`);
  console.log(`  - GET    /api/requests`);
  console.log(`  - POST   /api/requests`);
  console.log(`  - PATCH  /api/requests/:id/status`);
  console.log(`  - PATCH  /api/requests/:id/assign`);
  console.log(`  - GET    /api/requests/calendar?type=Preventive`);
});
