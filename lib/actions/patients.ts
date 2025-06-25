'use server'

import { readData, writeData } from '@/lib/db';

interface Patient {
  id: string;
  patientId: string;
  name: string;
  email?: string;
  phone: string;
  gender: string;
  age: number;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: string; // Store as ISO string
}

export function generatePatientId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getPatients() {
  try {
    const patients = await readData<Patient[]>('patients', []);
    
    // Convert string dates to Date objects for the client
    return patients.map(patient => ({
      ...patient,
      createdAt: new Date(patient.createdAt)
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
}

export async function deletePatient(id: string) {
  try {
    const patients = await readData<Patient[]>('patients', []);
    const updatedPatients = patients.filter(patient => patient.id !== id);
    await writeData('patients', updatedPatients);
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
}