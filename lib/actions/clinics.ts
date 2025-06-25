'use server'

import { readData, writeData } from '@/lib/db';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  stats?: {
    patients: number;
    appointments: number;
    doctors: number;
  };
}

export async function getClinics() {
  try {
    const clinics = await readData<Clinic[]>('clinics', []);
    
    // If no clinics found, return mock data
    if (clinics.length === 0) {
      return [
        {
          id: '1',
          name: 'Vishnu Clinic',
          address: '123 Health Street, Medical District',
          phone: '+91-9876543210',
          email: 'info@vishnuclinic.com',
          description: 'A modern healthcare facility providing comprehensive medical services',
          stats: {
            patients: 350,
            appointments: 120,
            doctors: 15
          }
        },
        {
          id: '2',
          name: 'City Health Center',
          address: '456 Medical Avenue, Downtown',
          phone: '+91-9876543211',
          email: 'info@cityhealthcenter.com',
          description: 'Providing quality healthcare services to urban communities',
          stats: {
            patients: 520,
            appointments: 210,
            doctors: 22
          }
        },
        {
          id: '3',
          name: 'Rural Medical Clinic',
          address: '789 Village Road, Countryside',
          phone: '+91-9876543212',
          email: 'info@ruralmedical.com',
          description: 'Bringing healthcare services to rural communities',
          stats: {
            patients: 180,
            appointments: 75,
            doctors: 8
          }
        },
        {
          id: '4',
          name: 'Family Care Center',
          address: '321 Family Street, Residential Area',
          phone: '+91-9876543213',
          email: 'info@familycare.com',
          description: 'Comprehensive healthcare for the entire family',
          stats: {
            patients: 420,
            appointments: 160,
            doctors: 18
          }
        },
        {
          id: '5',
          name: 'Specialty Medical Center',
          address: '654 Specialist Road, Medical Hub',
          phone: '+91-9876543214',
          email: 'info@specialtymedical.com',
          description: 'Advanced care for specialized medical conditions',
          stats: {
            patients: 280,
            appointments: 130,
            doctors: 25
          }
        }
      ];
    }

    return clinics;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }
}

export async function getClinicById(id: string) {
  try {
    const clinics = await readData<Clinic[]>('clinics', []);
    return clinics.find(clinic => clinic.id === id) || null;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return null;
  }
}