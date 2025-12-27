# 🚀 Quick Start Guide - GearGuard Backend

## ⚡ 3-Step Setup

### Step 1: Supabase Setup (5 minutes)

1. Visit [supabase.com](https://supabase.com) → Create account → New Project
2. Copy these 3 values from **Project Settings > API**:
   - Project URL
   - anon key  
   - service_role key

3. Update `server/.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

4. In Supabase Dashboard → **SQL Editor** → Paste entire contents of `server/database/schema.sql` → **Run**

5. In Supabase → **Authentication** → **Users** → **Add user**:
   - Email: `admin@gearguard.com`
   - Password: `YourSecurePassword123`
   - User Metadata (JSON):
   ```json
   {
     "full_name": "System Admin",
     "role": "admin"
   }
   ```

### Step 2: Start Backend (1 minute)

```bash
cd server
npm install  # Already done!
npm run dev
```

✅ Server running on http://localhost:5000

### Step 3: Test Authentication (30 seconds)

**Login Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gearguard.com\",\"password\":\"YourSecurePassword123\"}"
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "admin@gearguard.com",
    "full_name": "System Admin",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Test Protected Endpoint:**
```bash
curl http://localhost:5000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 User Role Quick Reference

| Action | Admin | Manager | Technician |
|--------|-------|---------|------------|
| Create users | ✅ All | ✅ Technicians only | ❌ |
| Add equipment | ✅ | ✅ | ❌ |
| Create requests | ✅ | ✅ | ❌ |
| Assign technicians | ✅ | ✅ | ❌ |
| Update request status | ✅ | ✅ | ✅ Own only |
| View all requests | ✅ | ✅ | ❌ Own only |
| Delete users/equipment | ✅ | ❌ | ❌ |

## 🎯 Key Endpoints

```
Public:
POST   /api/auth/login                  # Login to get token

Authenticated (All):
GET    /api/auth/me                     # Get current user
GET    /api/equipment                   # List all equipment
GET    /api/teams                       # List all teams
GET    /api/requests                    # List requests (filtered by role)

Admin/Manager Only:
POST   /api/auth/register               # Create new user
POST   /api/equipment                   # Add equipment
POST   /api/teams                       # Create team
POST   /api/requests                    # Create maintenance request
PATCH  /api/requests/:id/assign         # Assign technician

Admin Only:
DELETE /api/auth/users/:id              # Delete user
```

## 🔧 Commands

```bash
npm run dev      # Development server (auto-reload)
npm run build    # Build for production
npm start        # Run production server
```

## 📱 Frontend Integration

**1. Store token after login:**
```typescript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { user, token } = await response.json();
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

**2. Add token to all requests:**
```typescript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/equipment', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**3. Role-based UI:**
```tsx
const user = JSON.parse(localStorage.getItem('user'));

{(user.role === 'admin' || user.role === 'manager') && (
  <button onClick={addEquipment}>Add Equipment</button>
)}
```

## 🚨 Troubleshooting

**Issue: "Missing Supabase environment variables"**
→ Update `.env` with your Supabase credentials

**Issue: Cannot find module '@supabase/supabase-js'**
→ Run: `npm install`

**Issue: "Invalid or expired token"**
→ Login again to get a fresh token

**Issue: "User not found after registration"**
→ Check that database schema was run correctly

## 📚 Full Documentation

- **Complete Setup**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Migration Details**: [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- **API Reference**: [README.md](./README.md)
- **Database Schema**: [database/schema.sql](./database/schema.sql)

---

**Need Help?** Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions!
