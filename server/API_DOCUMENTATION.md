# GearGuard Backend - API Reference

## Base URL
```
http://localhost:5000
```

## Equipment Endpoints

### Get All Equipment
```http
GET /api/equipment
```

### Create Equipment
```http
POST /api/equipment
Content-Type: application/json

{
  "name": "Laptop Dell XPS 15",
  "serialNumber": "SN12345",
  "department": "IT",
  "assignedEmployee": "John Doe",
  "purchaseDate": "2024-01-15",
  "warrantyExpiry": "2027-01-15",
  "location": "Office 301",
  "maintenanceTeamId": "team-1",
  "defaultTechnicianId": "tech-1"
}
```

### Get Equipment by ID
```http
GET /api/equipment/:id
```

### Get Equipment Requests
```http
GET /api/equipment/:id/requests
```

## Team Endpoints

### Get All Teams
```http
GET /api/teams
```

### Create Team
```http
POST /api/teams
Content-Type: application/json

{
  "name": "IT Support Team",
  "members": [
    {
      "id": "tech-1",
      "name": "Alice Smith",
      "avatarUrl": "https://example.com/avatar1.jpg"
    },
    {
      "id": "tech-2",
      "name": "Bob Johnson",
      "avatarUrl": "https://example.com/avatar2.jpg"
    }
  ]
}
```

## Maintenance Request Endpoints

### Get All Requests
```http
GET /api/requests
```

### Create Request
```http
POST /api/requests
Content-Type: application/json

{
  "subject": "Laptop screen flickering",
  "type": "Corrective",
  "equipmentId": "eq-123",
  "scheduledDate": "2024-01-20",
  "duration": 2
}
```
*Note: maintenanceTeamId and technicianId are auto-filled from equipment*

### Update Request Status
```http
PATCH /api/requests/:id/status
Content-Type: application/json

{
  "status": "In Progress"
}
```
*Valid transitions: New → In Progress → Repaired, or any → Scrap*

### Assign Technician
```http
PATCH /api/requests/:id/assign
Content-Type: application/json

{
  "technicianId": "tech-2"
}
```

### Get Calendar Requests
```http
GET /api/requests/calendar?type=Preventive
```
*type can be "Preventive" or "Corrective"*

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
