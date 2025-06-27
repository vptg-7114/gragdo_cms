'use server'

import { readData, writeData } from '@/lib/db';
import { UserRole, User } from '@/lib/types';

export async function getUserProfile(userId?: string) {
  try {
    const users = await readData<User[]>('users', []);
    const clinics = await readData('clinics', []);
    
    // If userId is provided, get that specific user
    // Otherwise, for demo purposes, we'll get the first user
    const user = userId 
      ? users.find(u => u.id === userId)
      : users[0];
    
    if (!user) {
      return null;
    }

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