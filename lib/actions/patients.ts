"use server";

import { findById, readData, createItem, updateItem, deleteItem } from "@/lib/db";
import { generatePatientId } from "@/lib/utils";

// Define the gender enum
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

// Define the patient interface
interface Patient {
  id: string;
  patientId: string;
  name: string;
  email?: string;
  phone: string;
  gender: Gender;
  age: number;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  clinicId: string;
  createdById: string;
  createdAt: string; // Store as ISO string
  updatedAt: string; // Store as ISO string
}

export async function createPatient(data: {
  name: string;
  email?: string;
  phone: string;
  gender: Gender;
  age: number;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  clinicId: string;
  createdById: string;
}) {
  try {
    const patientId = generatePatientId();
    const now = new Date().toISOString();
    
    const patient = await createItem<Patient>("patients", {
      ...data,
      patientId,
      createdAt: now,
      updatedAt: now
    });

    return { success: true, patient };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Failed to create patient' };
  }
}

export async function updatePatient(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  age?: number;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
}) {
  try {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const patient = await updateItem<Patient>("patients", id, updatedData);
    
    if (!patient) {
      return { success: false, error: 'Patient not found' };
    }
    
    return { success: true, patient };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Failed to update patient' };
  }
}

export async function deletePatient(id: string) {
  try {
    const success = await deleteItem<Patient>("patients", id);
    
    if (!success) {
      return { success: false, error: 'Patient not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
}

export async function getPatients(clinicId?: string) {
  try {
    const patients = await readData<Patient>("patients");
    
    // Filter by clinicId if provided
    const filteredPatients = clinicId 
      ? patients.filter(p => p.clinicId === clinicId)
      : patients;
    
    // Sort by createdAt in descending order
    return filteredPatients.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await findById<Patient>("patients", id);
    
    if (!patient) {
      return null;
    }
    
    // Get appointments for this patient
    const appointments = await readData<any>("appointments");
    const patientAppointments = appointments
      .filter(a => a.patientId === id)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    // Get doctor details for each appointment
    const appointmentsWithDoctors = await Promise.all(
      patientAppointments.map(async (appointment) => {
        const doctor = await findById("doctors", appointment.doctorId);
        return {
          ...appointment,
          doctor,
          appointmentDate: new Date(appointment.appointmentDate)
        };
      })
    );
    
    return {
      ...patient,
      appointments: appointmentsWithDoctors
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}