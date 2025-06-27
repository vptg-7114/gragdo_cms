'use server'

import { readData, writeData } from '@/lib/db';
import { UserRole } from '@/lib/types';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  clinicId?: string;
  createdAt: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
}

export async function getUserProfile(userId?: string) {
  try {
    const users = await readData<User[]>('users', []);
    const clinics = await readData<Clinic[]>('clinics', []);
    
    // For demo purposes, we'll get the first user
    // In a real app, you'd get the current authenticated user
    const user = users[0] || {
      id: '1',
      name: 'Clinic Admin',
      email: 'admin@vishnuclinic.com',
      phone: '+91-9876543210',
      role: UserRole.ADMIN,
      clinicId: '1',
      createdAt: new Date().toISOString()
    };

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
        name: clinic.name,
        address: clinic.address
      } : undefined,
      createdAt: new Date(user.createdAt)
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Return mock data for demo
    return {
      id: '1',
      name: 'Clinic Admin',
      email: 'admin@vishnuclinic.com',
      phone: '+91-9876543210',
      role: UserRole.ADMIN,
      address: '123 Health Street, Medical District',
      bio: 'Experienced healthcare administrator with over 10 years in clinic management.',
      profileImage: undefined,
      clinic: {
        name: 'Vishnu Clinic',
        address: '123 Health Street, Medical District'
      },
      createdAt: new Date('2024-01-01')
    };
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
    // In a real app, you would update the user in the database
    // For now, we'll just simulate a successful update
    console.log('Updating user profile:', userId, data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}