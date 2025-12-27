import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GearGuard Server is running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}`);
  console.log(`🔐 Authentication: Supabase (JWT)`);
  console.log(`🗄️  Database: Supabase PostgreSQL`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`\n  Authentication:`);
  console.log(`  - POST   /api/auth/login`);
  console.log(`  - POST   /api/auth/register (Admin/Manager only)`);
  console.log(`  - GET    /api/auth/me`);
  console.log(`  - GET    /api/auth/users (Admin/Manager only)`);
  console.log(`  - GET    /api/auth/users/role/:role (Admin/Manager only)`);
  console.log(`  - PATCH  /api/auth/users/:id (Admin/Manager only)`);
  console.log(`  - DELETE /api/auth/users/:id (Admin only)`);
  console.log(`\n  Equipment:`);
  console.log(`  - GET    /api/equipment`);
  console.log(`  - POST   /api/equipment (Admin/Manager only)`);
  console.log(`  - GET    /api/equipment/:id`);
  console.log(`  - PATCH  /api/equipment/:id (Admin/Manager only)`);
  console.log(`  - GET    /api/equipment/:id/requests`);
  console.log(`\n  Teams:`);
  console.log(`  - GET    /api/teams`);
  console.log(`  - POST   /api/teams (Admin/Manager only)`);
  console.log(`  - GET    /api/teams/technicians`);
  console.log(`\n  Maintenance Requests:`);
  console.log(`  - GET    /api/requests`);
  console.log(`  - POST   /api/requests (Admin/Manager only)`);
  console.log(`  - PATCH  /api/requests/:id/status`);
  console.log(`  - PATCH  /api/requests/:id/assign (Admin/Manager only)`);
  console.log(`  - GET    /api/requests/calendar?type=Preventive`);
  console.log(`\n👥 User Roles:`);
  console.log(`  - Admin: Full access to all features`);
  console.log(`  - Manager: Can manage equipment, requests, and create technicians`);
  console.log(`  - Technician: Can view and update assigned maintenance requests`);
});
