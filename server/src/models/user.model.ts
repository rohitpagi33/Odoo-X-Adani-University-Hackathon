import { supabaseAdmin } from '../config/supabase';
import { User, LoginCredentials, RegisterData } from '../types/auth.types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// User database operations
export const findUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }

  return data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
};

export const getUsersByRole = async (role: 'admin' | 'manager' | 'technician'): Promise<User[]> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('role', role)
    .order('full_name');

  if (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }

  return data || [];
};

export const createUser = async (userData: RegisterData, createdBy?: string): Promise<User | null> => {
  try {
    const hashed = await bcrypt.hash(userData.password, 10)
    const newUser: Omit<User, 'created_at' | 'updated_at'> & { password: string } = {
      id: uuidv4(),
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role,
      avatar_url: undefined,
      created_by: createdBy,
      password: hashed,
    }
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([newUser])
      .select('id, email, full_name, role, avatar_url, created_by, created_at, updated_at')
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return data as User
  } catch (error) {
    console.error('Error in createUser:', error)
    return null
  }
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in deleteUser:', error)
    return false
  }
};

// Authentication operations
export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; token: string } | null> => {
  try {
    // Fetch user with password
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, avatar_url, created_by, created_at, updated_at, password')
      .eq('email', credentials.email)
      .single()

    if (error || !data) {
      return null
    }
    const valid = await bcrypt.compare(credentials.password, data.password)
    if (!valid) {
      return null
    }

    const user: User = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      avatar_url: data.avatar_url || undefined,
      created_by: data.created_by || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '12h' })
    return { user, token }
  } catch (error) {
    console.error('Error in loginUser:', error)
    return null
  }
};

export const logoutUser = async (_token: string): Promise<boolean> => {
  // Stateless JWT logout handled client-side; nothing to do server-side
  return true
};
