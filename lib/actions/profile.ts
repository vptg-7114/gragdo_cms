'use server'

import { readData, writeData, findById } from '@/lib/db';
import { UserRole, User } from '@/lib/types';

export async function getUserProfile(userId?: string) {
  try {
    if (!userId) {
      // For demo purposes, return a default profile
      return {
        id: 'default-user',
        name: 'Demo User',
        email: 'demo@digigo.com',
        phone: '+91-9999999999',
        role: UserRole.STAFF,
        clinic: {
          id: 'cli-001',
          name: 'Vishnu Clinic',
          address: '123 Health Street, Medical District, Hyderabad'
        },
        createdAt: new Date()
      };
    }

    const user = await findById<User>('users', userId);
    
    if (!user) {
      return null;
    }

    const clinics = await readData('clinics', []);
    const clinic = user.clinicId ? clinics.find(c => c.id === user.clinicId) : undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: undefined, // Add address field to User model if needed
      bio: undefined, // Add bio field to User model if needed
      profileImage: undefined, // Add profileImage field to User model if needed
      clinic: clinic ? {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address
      } : undefined,
      createdAt: new Date(user.createdAt)
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
}) {
  try {
    const users = await readData<User[]>('users', []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    await writeData('users', users);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}