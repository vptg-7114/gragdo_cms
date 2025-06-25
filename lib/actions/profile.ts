import { readData, findById, updateItem } from '@/lib/db';

export async function getUserProfile(userId?: string) {
  try {
    // For demo purposes, we'll get the first user
    // In a real app, you'd get the current authenticated user
    const users = await readData('users.json');
    const user = userId ? users.find(u => u.id === userId) : users[0];
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get clinic details if user has a clinicId
    let clinic = null;
    if (user.clinicId) {
      const clinics = await readData('clinics.json');
      clinic = clinics.find(c => c.id === user.clinicId);
    }
    
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
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Return mock data for demo
    return {
      id: '1',
      name: 'Clinic Admin',
      email: 'admin@vishnuclinic.com',
      phone: '+91-9876543210',
      role: 'ADMIN',
      address: '123 Health Street, Medical District',
      bio: 'Experienced healthcare administrator with over 10 years in clinic management.',
      profileImage: undefined,
      clinic: {
        name: 'Vishnu Clinic',
        address: '123 Health Street, Medical District'
      },
      createdAt: new Date('2024-01-01').toISOString()
    };
  }
}

export async function updateUserProfile(userId: string, data: {
  name?: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  profileImage?: string
}) {
  try {
    // In a real app, you would update the user in the database
    const users = await readData('users.json');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    // Write updated users back to file
    const fs = require('fs/promises');
    const path = require('path');
    await fs.writeFile(
      path.join(process.cwd(), 'data/users.json'),
      JSON.stringify(users, null, 2)
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}