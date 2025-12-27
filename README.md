# 🔧 GearGuard - Maintenance Management System

> **Transforming Industrial Maintenance with Intelligent Workflow Automation**

A comprehensive maintenance management platform built during the **Odoo × Adani University Hackathon** that streamlines equipment maintenance, request tracking, and team collaboration across multiple organizational roles.

---

## ✨ Features

### 🎯 Core Features
- **📋 Maintenance Requests** - Create, track, and manage maintenance requests with priority levels
- **🏭 Equipment Management** - Comprehensive equipment inventory with maintenance history
- **👥 Team Management** - Organize technicians into teams with role-based assignments
- **📅 Maintenance Calendar** - Visual timeline of scheduled maintenance activities
- **📊 Kanban Board** - Interactive workflow management (Pending → In Progress → Completed)
- **📈 Reports & Analytics** - Detailed maintenance insights and performance metrics

### 🔐 Role-Based Access Control
- **Admin** - Full system control, user management, global insights
- **Manager** - Team oversight, request management, team scheduling
- **Technician** - Task assignment, status updates, work tracking

### 💡 Advanced Features
- Real-time status updates with PDF report uploads
- Responsive design for desktop and mobile devices
- Edit capabilities for requests, equipment, teams, and users
- Search and filtering across all resources
- Secure authentication with JWT tokens
- Email notifications (with fallback support)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with Turbopack
- **UI Library**: [React 18](https://react.dev/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Form Management**: React Hooks

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [JWT](https://jwt.io/)
- **Email Service**: [Nodemailer](https://nodemailer.com/)

### DevOps & Tools
- **Package Manager**: pnpm
- **Version Control**: Git
- **Database ORM**: Supabase Client
- **Environment Management**: dotenv

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **pnpm** (recommended) or npm
- **Supabase** account (free tier works)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Odoo-X-Adani-University-Hackathon
```

#### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Update .env with your Supabase credentials
pnpm install
pnpm run dev
```

Backend runs on: `http://localhost:5000`

#### 3. Setup Frontend
```bash
cd client
pnpm install
pnpm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📁 Project Structure

```
Odoo-X-Adani-University-Hackathon/
├── client/                          # Next.js Frontend
│   ├── app/                        # App Router (Pages)
│   │   ├── admin/                 # Admin Dashboard & CRUD Pages
│   │   ├── manager/               # Manager Dashboard
│   │   ├── technician/            # Technician Dashboard
│   │   └── login/                 # Authentication
│   ├── components/                # Reusable React Components
│   │   ├── auth/                 # Auth Guards
│   │   ├── calendar/             # Maintenance Calendar
│   │   ├── equipment/            # Equipment Management
│   │   ├── requests/             # Request Management & Kanban
│   │   ├── teams/                # Team Management
│   │   ├── users/                # User Management
│   │   └── ui/                   # shadcn/ui Components
│   ├── hooks/                     # Custom React Hooks
│   ├── lib/                       # Utilities & API Client
│   └── styles/                    # Global Styles
│
├── server/                         # Express.js Backend
│   ├── src/
│   │   ├── controllers/          # Request Handlers
│   │   ├── models/               # Database Models
│   │   ├── routes/               # API Routes
│   │   ├── services/             # Business Logic
│   │   ├── middleware/           # Auth & Validators
│   │   ├── config/               # Configuration
│   │   ├── types/                # TypeScript Types
│   │   ├── app.ts                # Express App Setup
│   │   └── server.ts             # Server Entry Point
│   ├── database/
│   │   └── schema.sql            # PostgreSQL Schema
│   └── API_DOCUMENTATION.md      # API Reference
│
└── README.md                       # Project Documentation
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `PATCH /api/auth/users/:id` - Update user

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Create equipment
- `PATCH /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `PATCH /api/teams/:id` - Update team
- `GET /api/teams/:id` - Get team details

### Maintenance Requests
- `GET /api/requests` - List requests (role-based)
- `POST /api/requests` - Create request
- `PATCH /api/requests/:id` - Update request
- `PATCH /api/requests/:id/status` - Update request status with notes & PDF

### Users
- `GET /api/auth/users` - List all users (Admin only)
- `PATCH /api/auth/users/:id` - Update user (Admin only)

---

## 🎨 Dashboard Features

### Admin Dashboard
- 📊 System Overview & Statistics
- 👤 User Management (Create, Edit, Delete)
- 🏭 Equipment Inventory Management
- 👥 Team Composition & Management
- 📋 All Maintenance Requests
- 🔍 Search & Filtering Across Resources
- 📈 Comprehensive Reports

### Manager Dashboard
- 📋 Team Requests & Assignments
- 👥 Team Members Overview
- 📅 Team Schedule & Calendar
- 📊 Team Performance Metrics
- 🏭 Assigned Equipment View

### Technician Dashboard
- 📋 Assigned Tasks & Requests
- 🔄 Status Updates with Work Logs
- 📅 Personal Work Schedule
- 📊 Task Statistics & Performance

---

## 🔒 Security Features

- ✅ JWT-based Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Row Level Security (RLS) in PostgreSQL
- ✅ Password Hashing with Bcrypt
- ✅ Secure Environment Variables
- ✅ Protected API Routes
- ✅ Input Validation & Sanitization

---

## 📝 Database Schema Highlights

### Core Tables
- `users` - User accounts with roles
- `equipment` - Maintenance equipment inventory
- `teams` - Maintenance teams
- `team_members` - Team composition
- `maintenance_requests` - Request tracking
- `request_status_history` - Audit trail

### Key Relationships
- Users → Teams (Manager relationship)
- Teams → Technicians (Members)
- Equipment → Teams (Assignment)
- Requests → Equipment, Teams, Technicians

---

## 🧪 Testing

### Manual Testing Checklist
-  User registration and login
-  Equipment CRUD operations
-  Team management and member assignment
-  Maintenance request creation and status updates
-  Calendar view and filtering
-  Kanban board drag-and-drop
-  PDF report upload
-  Role-based visibility and access
-  Search and filter functionality

---

## 🚧 Development Workflow

### Running Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd server && pnpm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client && pnpm run dev
```

### Build for Production

**Backend:**
```bash
cd server && pnpm run build && pnpm start
```

**Frontend:**
```bash
cd client && pnpm run build && pnpm start
```

---

## 📊 Key Metrics

- **Dashboard Views**: 3 (Admin, Manager, Technician)
- **API Endpoints**: 20+
- **Database Tables**: 8+
- **React Components**: 50+
- **UI Components Used**: 40+

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Documentation

- [API Documentation](./server/API_DOCUMENTATION.md)
- [Database Schema](./server/database/schema.sql)
- [Setup Guide](./server/setup.md)
- [Supabase Setup](./server/SUPABASE_SETUP.md)
- [Migration Summary](./server/MIGRATION_SUMMARY.md)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Odoo & Adani University** for organizing this amazing hackathon
- **shadcn/ui** for the beautiful component library
- **Supabase** for the excellent backend infrastructure
- Our incredible team for the dedication and hard work!

---
