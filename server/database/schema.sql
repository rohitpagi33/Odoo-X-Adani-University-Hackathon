-- ================================================
-- GearGuard Database Schema - Supabase PostgreSQL
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- ENUMS
-- ================================================

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'technician');
CREATE TYPE request_type AS ENUM ('Corrective', 'Preventive');
CREATE TYPE request_status AS ENUM ('New', 'In Progress', 'Repaired', 'Scrap');

-- ================================================
-- USERS TABLE (extends Supabase auth.users)
-- ================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'technician',
  avatar_url TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster role-based queries
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_created_by ON public.users(created_by);

-- ================================================
-- MAINTENANCE TEAMS TABLE
-- ================================================

CREATE TABLE public.maintenance_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for team lookups
CREATE INDEX idx_teams_created_by ON public.maintenance_teams(created_by);

-- ================================================
-- TEAM MEMBERS TABLE (Many-to-Many)
-- ================================================

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.maintenance_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  added_by UUID REFERENCES public.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Indexes for team member lookups
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

-- ================================================
-- EQUIPMENT TABLE
-- ================================================

CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(255) NOT NULL,
  assigned_employee VARCHAR(255),
  purchase_date DATE NOT NULL,
  warranty_expiry DATE,
  location VARCHAR(255) NOT NULL,
  maintenance_team_id UUID REFERENCES public.maintenance_teams(id),
  default_technician_id UUID REFERENCES public.users(id),
  is_scrapped BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for equipment queries
CREATE INDEX idx_equipment_serial_number ON public.equipment(serial_number);
CREATE INDEX idx_equipment_department ON public.equipment(department);
CREATE INDEX idx_equipment_maintenance_team ON public.equipment(maintenance_team_id);
CREATE INDEX idx_equipment_default_technician ON public.equipment(default_technician_id);
CREATE INDEX idx_equipment_is_scrapped ON public.equipment(is_scrapped);

-- ================================================
-- MAINTENANCE REQUESTS TABLE
-- ================================================

CREATE TABLE public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject VARCHAR(500) NOT NULL,
  description TEXT,
  type request_type NOT NULL,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  maintenance_team_id UUID REFERENCES public.maintenance_teams(id),
  technician_id UUID REFERENCES public.users(id),
  scheduled_date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in hours
  status request_status NOT NULL DEFAULT 'New',
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for maintenance request queries
CREATE INDEX idx_requests_equipment_id ON public.maintenance_requests(equipment_id);
CREATE INDEX idx_requests_technician_id ON public.maintenance_requests(technician_id);
CREATE INDEX idx_requests_maintenance_team ON public.maintenance_requests(maintenance_team_id);
CREATE INDEX idx_requests_status ON public.maintenance_requests(status);
CREATE INDEX idx_requests_type ON public.maintenance_requests(type);
CREATE INDEX idx_requests_scheduled_date ON public.maintenance_requests(scheduled_date);
CREATE INDEX idx_requests_created_by ON public.maintenance_requests(created_by);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- ================================================
-- USERS POLICIES
-- ================================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Admins and Managers can view all users
CREATE POLICY "Admins and Managers can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Only Admins can insert users
CREATE POLICY "Only Admins can create users"
  ON public.users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any user, Managers can update technicians
CREATE POLICY "Admins and Managers can update users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND (
        role = 'admin' OR
        (role = 'manager' AND (SELECT role FROM public.users WHERE id = public.users.id) = 'technician')
      )
    )
  );

-- ================================================
-- MAINTENANCE TEAMS POLICIES
-- ================================================

-- All authenticated users can view teams
CREATE POLICY "All users can view teams"
  ON public.maintenance_teams FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admins and Managers can create teams
CREATE POLICY "Admins and Managers can create teams"
  ON public.maintenance_teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Admins and Managers can update teams
CREATE POLICY "Admins and Managers can update teams"
  ON public.maintenance_teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- ================================================
-- TEAM MEMBERS POLICIES
-- ================================================

-- All authenticated users can view team members
CREATE POLICY "All users can view team members"
  ON public.team_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admins and Managers can add team members
CREATE POLICY "Admins and Managers can add team members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Admins and Managers can remove team members
CREATE POLICY "Admins and Managers can remove team members"
  ON public.team_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- ================================================
-- EQUIPMENT POLICIES
-- ================================================

-- All authenticated users can view equipment
CREATE POLICY "All users can view equipment"
  ON public.equipment FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admins and Managers can create equipment
CREATE POLICY "Admins and Managers can create equipment"
  ON public.equipment FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Admins and Managers can update equipment
CREATE POLICY "Admins and Managers can update equipment"
  ON public.equipment FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Only Admins can delete equipment
CREATE POLICY "Only Admins can delete equipment"
  ON public.equipment FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- MAINTENANCE REQUESTS POLICIES
-- ================================================

-- All users can view requests (filtered by role in application logic)
CREATE POLICY "All users can view requests"
  ON public.maintenance_requests FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admins and Managers can create requests
CREATE POLICY "Admins and Managers can create requests"
  ON public.maintenance_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Admins, Managers, and assigned Technicians can update requests
CREATE POLICY "Authorized users can update requests"
  ON public.maintenance_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND (
        role IN ('admin', 'manager') OR
        (role = 'technician' AND id = maintenance_requests.technician_id)
      )
    )
  );

-- Only Admins can delete requests
CREATE POLICY "Only Admins can delete requests"
  ON public.maintenance_requests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_teams_updated_at BEFORE UPDATE ON public.maintenance_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'technician')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- VIEWS FOR EASIER QUERIES
-- ================================================

-- View: Equipment with team and technician details
CREATE VIEW equipment_detailed AS
SELECT 
  e.*,
  mt.name as team_name,
  u.full_name as technician_name,
  u.email as technician_email
FROM public.equipment e
LEFT JOIN public.maintenance_teams mt ON e.maintenance_team_id = mt.id
LEFT JOIN public.users u ON e.default_technician_id = u.id;

-- View: Maintenance requests with all related details
CREATE VIEW requests_detailed AS
SELECT 
  mr.*,
  e.name as equipment_name,
  e.serial_number as equipment_serial,
  mt.name as team_name,
  u.full_name as technician_name,
  u.email as technician_email,
  creator.full_name as created_by_name
FROM public.maintenance_requests mr
JOIN public.equipment e ON mr.equipment_id = e.id
LEFT JOIN public.maintenance_teams mt ON mr.maintenance_team_id = mt.id
LEFT JOIN public.users u ON mr.technician_id = u.id
LEFT JOIN public.users creator ON mr.created_by = creator.id;

-- View: Overdue requests
CREATE VIEW overdue_requests AS
SELECT * FROM requests_detailed
WHERE scheduled_date < CURRENT_DATE
  AND status != 'Repaired';

-- ================================================
-- SEED DATA (Initial Admin User)
-- ================================================

-- Note: You'll need to create the first admin user through Supabase Auth
-- Then update their role manually or through the dashboard
-- Example: UPDATE public.users SET role = 'admin' WHERE email = 'admin@gearguard.com';

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Composite indexes for common query patterns
CREATE INDEX idx_requests_technician_status ON public.maintenance_requests(technician_id, status);
CREATE INDEX idx_requests_team_date ON public.maintenance_requests(maintenance_team_id, scheduled_date);
CREATE INDEX idx_equipment_team_scrapped ON public.equipment(maintenance_team_id, is_scrapped);

-- ================================================
-- GRANTS (if using service role)
-- ================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.maintenance_teams IS 'Teams responsible for equipment maintenance';
COMMENT ON TABLE public.team_members IS 'Many-to-many relationship between teams and technicians';
COMMENT ON TABLE public.equipment IS 'Equipment inventory with maintenance assignments';
COMMENT ON TABLE public.maintenance_requests IS 'Maintenance requests for equipment';

COMMENT ON COLUMN public.users.role IS 'User role: admin (full access), manager (can manage equipment and requests), technician (assigned tasks only)';
COMMENT ON COLUMN public.equipment.is_scrapped IS 'Equipment marked as scrapped (no longer in use)';
COMMENT ON COLUMN public.maintenance_requests.duration IS 'Estimated duration in hours';
