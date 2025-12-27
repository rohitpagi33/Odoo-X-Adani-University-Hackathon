# GearGuard - Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
5. Choose a database password (save it!)
6. Wait for the project to be ready (~2 minutes)

### 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

### 3. Update .env File

Edit `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret (optional - Supabase handles JWT)
JWT_SECRET=your_jwt_secret_key
```

### 4. Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the script

This will create:
- All tables (users, equipment, teams, requests)
- Row Level Security policies
- Triggers and functions
- Indexes for performance
- Views for easier queries

### 5. Create Your First Admin User

#### Option A: Through Supabase Dashboard (Recommended)

1. Go to **Authentication** > **Users** in Supabase
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: `admin@gearguard.com`
   - Password: (choose a secure password)
   - Confirm password
   - Under "User Metadata" add:
     ```json
     {
       "full_name": "System Administrator",
       "role": "admin"
     }
     ```
4. Click "Create user"

#### Option B: Using SQL

```sql
-- Run this in SQL Editor after the user signs up through your app
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@gearguard.com';
```

### 6. Install Dependencies

```bash
cd server
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `jsonwebtoken` - JWT handling
- Other dependencies

### 7. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📝 Testing the API

### 1. Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@gearguard.com",
  "password": "your_password"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@gearguard.com",
    "full_name": "System Administrator",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Use the Token

For all protected endpoints, include the token in the Authorization header:

```bash
GET http://localhost:5000/api/equipment
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 User Roles & Permissions

### Admin
- ✅ Create managers and technicians
- ✅ Full access to all equipment
- ✅ Create and manage maintenance teams
- ✅ Create and manage maintenance requests
- ✅ Assign technicians to requests
- ✅ Delete users and equipment

### Manager
- ✅ Create technicians only
- ✅ Add equipment
- ✅ Create maintenance requests
- ✅ Assign technicians to requests
- ✅ View all equipment and requests
- ❌ Cannot create admins or managers
- ❌ Cannot delete users

### Technician
- ✅ View assigned maintenance requests
- ✅ Update status of assigned requests
- ✅ View equipment details
- ❌ Cannot create equipment
- ❌ Cannot create requests
- ❌ Cannot create users

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Endpoint-level permission checks
- **Password Hashing**: Automatic by Supabase Auth
- **Audit Trail**: created_by and created_at tracking

## 🗄️ Database Schema

- **users**: User profiles with roles
- **maintenance_teams**: Teams of technicians
- **team_members**: Many-to-many team memberships
- **equipment**: Equipment inventory
- **maintenance_requests**: Maintenance work orders

## 📚 API Endpoints

See `API_DOCUMENTATION.md` for complete endpoint documentation.

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure you've updated `.env` with your Supabase credentials

### Issue: "Invalid JWT"
**Solution**: Login again to get a fresh token

### Issue: "Row level security policy violation"
**Solution**: Check that the user has the correct role in the database

### Issue: "User not found after registration"
**Solution**: Make sure the trigger `on_auth_user_created` is created in the database

## 🔄 Database Migration

If you need to reset the database:

1. Go to Supabase Dashboard > Database > Schema
2. Drop all tables (or use SQL Editor to drop schema)
3. Re-run `database/schema.sql`
4. Create admin user again

## 📞 Support

For issues, check:
- Supabase logs: Dashboard > Logs
- Server logs: Check terminal output
- Browser console: For frontend errors
