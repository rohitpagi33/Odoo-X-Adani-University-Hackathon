# GearGuard Backend (Node.js + Express + MVC)

## Tech Stack
- Node.js
- Express.js
- TypeScript
- MVC Architecture
- REST API
- Use in-memory storage or MongoDB

---

## Folder Structure
src/
│
├── controllers/
│   ├── equipment.controller.ts
│   ├── team.controller.ts
│   ├── request.controller.ts
│
├── models/
│   ├── equipment.model.ts
│   ├── team.model.ts
│   ├── request.model.ts
│
├── routes/
│   ├── equipment.routes.ts
│   ├── team.routes.ts
│   ├── request.routes.ts
│
├── services/
│   ├── equipment.service.ts
│   ├── request.service.ts
│
├── app.ts
└── server.ts

---

## Data Models

### Equipment
- id
- name
- serialNumber
- department
- assignedEmployee
- purchaseDate
- warrantyExpiry
- location
- maintenanceTeamId
- defaultTechnicianId
- isScrapped (boolean)

### Maintenance Team
- id
- name
- members: Technician[]

### Technician
- id
- name
- avatarUrl

### Maintenance Request
- id
- subject
- type: "Corrective" | "Preventive"
- equipmentId
- maintenanceTeamId
- technicianId
- scheduledDate
- duration
- status: "New" | "In Progress" | "Repaired" | "Scrap"
- createdAt

---

## Business Logic

### Auto-fill Logic
When creating a request:
- Fetch Equipment
- Auto-fill:
  - maintenanceTeamId
  - technicianId (default)

### Workflow Rules
- New → In Progress → Repaired
- If moved to Scrap:
  - Set Equipment.isScrapped = true

### Overdue Logic
- If scheduledDate < today AND status != Repaired → overdue

---

## API Endpoints

### Equipment
- GET /api/equipment
- POST /api/equipment
- GET /api/equipment/:id
- GET /api/equipment/:id/requests

### Maintenance Teams
- GET /api/teams
- POST /api/teams

### Maintenance Requests
- GET /api/requests
- POST /api/requests
- PATCH /api/requests/:id/status
- PATCH /api/requests/:id/assign
- GET /api/requests/calendar?type=Preventive

---

## Controllers Responsibilities
- Controllers handle request/response
- Services handle logic
- Models define schema

---

## Extra
- Enable CORS
- Use express.json()
- Use proper HTTP status codes
