import { supabase, supabaseAdmin } from '../config/supabase';
import { User, LoginCredentials, RegisterData } from '../types/auth.types';

// User database operations
export const findUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
    // Create auth user using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
        role: userData.role
      }
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return null;
    }

    // Update user profile with created_by
    if (createdBy) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ created_by: createdBy })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
      }
    }

    // Fetch the created user profile
    const user = await findUserById(authData.user.id);
    return user;
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
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
    // Delete from auth.users (will cascade to public.users)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return false;
  }
};

// Authentication operations
export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; token: string } | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error || !data.user || !data.session) {
      console.error('Login error:', error);
      return null;
    }

    // Fetch user profile
    const userProfile = await findUserById(data.user.id);
    
    if (!userProfile) {
      return null;
    }

    return {
      user: userProfile,
      token: data.session.access_token
    };
  } catch (error) {
    console.error('Error in loginUser:', error);
    return null;
  }
};

export const logoutUser = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logoutUser:', error);
    return false;
  }
};
