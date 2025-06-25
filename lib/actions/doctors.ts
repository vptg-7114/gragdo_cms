'use server'

import { readData, writeData } from '@/lib/db';

interface Doctor {
  id: string;
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable: boolean;
  schedules?: any[];
  appointments?: any[];
}

export async function getDoctors() {
  try {
    const doctors = await readData<Doctor[]>('doctors', []);
    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctors = await readData<Doctor[]>('doctors', []);
    const doctor = doctors.find(doctor => doctor.id === id);
    
    if (!doctor) {
      return null;
    }
    
    // Return mock data for demo purposes
    return {
      ...doctor,
      appointments: doctor.appointments?.map(appointment => ({
        ...appointment,
        appointmentDate: new Date(appointment.appointmentDate)
      })) || []
    };
  } catch (error) {
    console.error('Error fetching doctor:', error);
    // Return mock data for demo purposes
    return {
      id: id,
      name: 'Dr. Ch. Asritha',
      email: 'asritha@vishnuclinic.com',
      phone: '+91-9876543214',
      specialization: 'Gynecology',
      qualification: 'MBBS, MS (Gynecology)',
      experience: 10,
      consultationFee: 400,
      isAvailable: true,
      schedules: [],
      appointments: []
    };
  }
}

export async function deleteDoctor(id: string) {
  try {
    const doctors = await readData<Doctor[]>('doctors', []);
    const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
    await writeData('doctors', updatedDoctors);
    return { success: true };
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return { success: false, error: 'Failed to delete doctor' };
  }
}