"use server";

import { readData, writeData } from "@/lib/db";
import { Clinic } from "@/lib/types";
import { generateId } from "@/lib/utils";

export async function createClinic(data: {
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    const clinics = await readData<Clinic[]>("clinics");
    
    const newClinic: Clinic = {
      id: `cli-${generateId(6)}`,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    clinics.push(newClinic);
    await writeData("clinics", clinics);

    return { success: true, clinic: newClinic };
  } catch (error) {
    console.error('Error creating clinic:', error);
    return { success: false, error: 'Failed to create clinic' };
  }
}

export async function updateClinic(id: string, data: {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}) {
  try {
    const clinics = await readData<Clinic[]>("clinics");
    const clinicIndex = clinics.findIndex(c => c.id === id);
    
    if (clinicIndex === -1) {
      return { success: false, error: 'Clinic not found' };
    }
    
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedClinic = {
      ...clinics[clinicIndex],
      ...updatedData
    };
    
    clinics[clinicIndex] = updatedClinic;
    await writeData("clinics", clinics);
    
    return { success: true, clinic: updatedClinic };
  } catch (error) {
    console.error('Error updating clinic:', error);
    return { success: false, error: 'Failed to update clinic' };
  }
}

export async function deleteClinic(id: string) {
  try {
    const clinics = await readData<Clinic[]>("clinics");
    const updatedClinics = clinics.filter(c => c.id !== id);
    
    if (updatedClinics.length === clinics.length) {
      return { success: false, error: 'Clinic not found' };
    }
    
    await writeData("clinics", updatedClinics);
    return { success: true };
  } catch (error) {
    console.error('Error deleting clinic:', error);
    return { success: false, error: 'Failed to delete clinic' };
  }
}

export async function getClinics() {
  try {
    const clinics = await readData<Clinic[]>("clinics");
    
    // Sort by name in ascending order
    const sortedClinics = clinics.sort((a, b) => a.name.localeCompare(b.name));
    
    // Add stats for each clinic
    const patients = await readData("patients");
    const appointments = await readData("appointments");
    const doctors = await readData("doctors");
    
    const clinicsWithStats = sortedClinics.map(clinic => {
      const clinicPatients = patients.filter(p => p.clinicId === clinic.id);
      const clinicAppointments = appointments.filter(a => a.clinicId === clinic.id);
      const clinicDoctors = doctors.filter(d => d.clinicId === clinic.id);
      
      return {
        ...clinic,
        stats: {
          patients: clinicPatients.length,
          appointments: clinicAppointments.length,
          doctors: clinicDoctors.length
        }
      };
    });
    
    return clinicsWithStats;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }
}

export async function getClinicById(id: string) {
  try {
    const clinics = await readData<Clinic[]>("clinics");
    const clinic = clinics.find(c => c.id === id);
    
    if (!clinic) {
      return null;
    }
    
    // Add stats for the clinic
    const patients = await readData("patients");
    const appointments = await readData("appointments");
    const doctors = await readData("doctors");
    
    const clinicPatients = patients.filter(p => p.clinicId === clinic.id);
    const clinicAppointments = appointments.filter(a => a.clinicId === clinic.id);
    const clinicDoctors = doctors.filter(d => d.clinicId === clinic.id);
    
    return {
      ...clinic,
      stats: {
        patients: clinicPatients.length,
        appointments: clinicAppointments.length,
        doctors: clinicDoctors.length
      }
    };
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return null;
  }
}