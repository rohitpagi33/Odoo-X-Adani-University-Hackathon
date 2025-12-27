# GearGuard Backend Server

A Node.js + Express + TypeScript backend for maintenance management using MVC architecture with **Supabase PostgreSQL** and **Role-Based Authentication**.

## 🚀 Quick Start

### 1. Setup Supabase Database

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Get your credentials
- Run the database schema
- Create the first admin user

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment

Update `.env` with your Supabase credentials:

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

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   └── supabase.ts  # Supabase client setup
├── controllers/      # Request/Response handlers
│   ├── auth.controller.ts
│   ├── equipment.controller.ts
│   ├── team.controller.ts
│   └── request.controller.ts
├── models/          # Data models and database operations
│   ├── user.model.ts
│   ├── equipment.model.ts
│   ├── team.model.ts
│   └── request.model.ts
├── routes/          # API route definitions
│   ├── auth.routes.ts
│   ├── equipment.routes.ts
│   ├── team.routes.ts
│   └── request.routes.ts
├── services/        # Business logic
│   ├── auth.service.ts
│   ├── equipment.service.ts
│   └── request.service.ts
├── middleware/      # Custom middleware
│   └── auth.middleware.ts
├── types/          # TypeScript type definitions
│   └── auth.types.ts
├── app.ts          # Express app configuration
└── server.ts       # Server entry point

database/
└── schema.sql      # Complete database schema
```

## 🔧 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - PostgreSQL database & authentication
- **JWT** - Token-based authentication
- **CORS** - Cross-origin support

## 📝 Features

- ✅ **MVC Architecture** - Clean separation of concerns
- ✅ **RESTful API** - Standard HTTP methods
- ✅ **Role-Based Access Control** - Admin, Manager, Technician roles
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Row Level Security** - Database-level access control
- ✅ **Auto-fill Logic** - Automatic field population
- ✅ **Workflow Validation** - Status transition rules
- ✅ **Audit Trail** - Track who created what and when
- ✅ **TypeScript** - Full type safety

## 👥 User Roles & Permissions

### Admin
- Create managers and technicians
- Full CRUD access to all resources
- Delete users and equipment
- Manage all maintenance requests

### Manager
- Create technicians only
- Add and manage equipment
- Create maintenance requests
- Assign technicians to tasks
- View all equipment and requests

### Technician  
- View assigned maintenance requests
- Update status of assigned requests
- View equipment details
- Read-only access to teams

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/login` | - | Public | User login |
| GET | `/me` | ✅ | All | Get current user |
| POST | `/register` | ✅ | Admin/Manager | Create new user |
| GET | `/users` | ✅ | Admin/Manager | Get all users |
| GET | `/users/role/:role` | ✅ | Admin/Manager | Get users by role |
| PATCH | `/users/:id` | ✅ | Admin/Manager | Update user |
| DELETE | `/users/:id` | ✅ | Admin | Delete user |

### Equipment (`/api/equipment`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ✅ | All | Get all equipment |
| POST | `/` | ✅ | Admin/Manager | Create equipment |
| GET | `/:id` | ✅ | All | Get equipment by ID |
| PATCH | `/:id` | ✅ | Admin/Manager | Update equipment |
| GET | `/:id/requests` | ✅ | All | Get equipment requests |

### Teams (`/api/teams`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ✅ | All | Get all teams |
| POST | `/` | ✅ | Admin/Manager | Create team |
| GET | `/technicians` | ✅ | All | Get all technicians |

### Maintenance Requests (`/api/requests`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ✅ | All | Get requests (filtered by role) |
| POST | `/` | ✅ | Admin/Manager | Create request |
| PATCH | `/:id/status` | ✅ | All | Update request status |
| PATCH | `/:id/assign` | ✅ | Admin/Manager | Assign technician |
| GET | `/calendar` | ✅ | All | Get calendar requests |

## 📦 Database Schema

- **users** - User profiles with roles (admin, manager, technician)
- **maintenance_teams** - Teams of technicians
- **team_members** - Many-to-many team memberships
- **equipment** - Equipment inventory with assignments
- **maintenance_requests** - Maintenance work orders

See [database/schema.sql](./database/schema.sql) for complete schema.

## 🔐 Authentication Flow

1. **Login**: POST `/api/auth/login` with email & password
2. **Get Token**: Receive JWT access token
3. **Use Token**: Include in Authorization header:
   ```
   Authorization: Bearer <token>
   ```
4. **Access Protected Routes**: Token is validated on each request

## 🧪 Testing the API

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gearguard.com", "password": "your_password"}'
```

### Example: Get Equipment (with auth)
```bash
curl http://localhost:5000/api/equipment \
  -H "Authorization: Bearer <your_token>"
```

### Example: Create Equipment (Manager/Admin only)
```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 15",
    "serial_number": "SN12345",
    "department": "IT",
    "location": "Office 301",
    "purchase_date": "2024-01-15",
    "maintenance_team_id": "team-uuid",
    "default_technician_id": "tech-uuid"
  }'
```

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Row Level Security (RLS)**: Database-level access control
- **Role-based Authorization**: Endpoint-level permission checks
- **Password Hashing**: Automatic by Supabase Auth
- **Audit Trail**: created_by and timestamps on all tables
- **Input Validation**: Type checking with TypeScript
- **CORS Configuration**: Controlled cross-origin access

## 🐛 Troubleshooting

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for common issues and solutions.

## 📖 Documentation

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete setup guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference (needs update for auth)
- [database/schema.sql](./database/schema.sql) - Database schema with comments

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Run the production server:
   ```bash
   npm start
   ```

4. Recommended platforms:
   - **Backend**: Heroku, Railway, Render, AWS, Google Cloud
   - **Database**: Already on Supabase (managed)

---

**Happy Coding! 🎉**

