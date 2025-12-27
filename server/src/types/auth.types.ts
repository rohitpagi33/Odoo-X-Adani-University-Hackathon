export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'technician';
  avatar_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'manager' | 'technician';
}
