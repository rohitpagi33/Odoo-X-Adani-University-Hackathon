import { loginUser, createUser, getAllUsers, getUsersByRole, updateUser as updateUserModel, deleteUser as deleteUserModel } from '../models/user.model';
import { User, RegisterData, LoginCredentials } from '../types/auth.types';

export const login = async (credentials: LoginCredentials) => {
  return await loginUser(credentials);
};

export const register = async (userData: RegisterData, createdBy?: string): Promise<User | null> => {
  return await createUser(userData, createdBy);
};

export const listAllUsers = async (): Promise<User[]> => {
  return await getAllUsers();
};

export const listUsersByRole = async (role: 'admin' | 'manager' | 'technician'): Promise<User[]> => {
  return await getUsersByRole(role);
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  return await updateUserModel(id, updates);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  return await deleteUserModel(id);
};
