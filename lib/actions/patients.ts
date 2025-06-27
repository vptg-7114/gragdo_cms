"use server";

import { readData, writeData } from "@/lib/db";
import { Gender, Patient } from "@/lib/types";

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
    const now = new Date().toISOString();
    
    const patients = await readData<Patient[]>("patients");
    
    // Generate a unique patient ID with prefix PAT
    const patientId = `PAT${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newPatient: Patient = {
      id: `pat-${(patients.length + 1).toString().padStart(3, '0')}`,
      patientId,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    patients.push(newPatient);
    await writeData("patients", patients);

    return { success: true, patient: newPatient };
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
    const patients = await readData<Patient[]>("patients");
    const patientIndex = patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return { success: false, error: 'Patient not found' };
    }
    
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedPatient = {
      ...patients[patientIndex],
      ...updatedData
    };
    
    patients[patientIndex] = updatedPatient;
    await writeData("patients", patients);
    
    return { success: true, patient: updatedPatient };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Failed to update patient' };
  }
}

export async function deletePatient(id: string) {
  try {
    const patients = await readData<Patient[]>("patients");
    const updatedPatients = patients.filter(p => p.id !== id);
    
    if (updatedPatients.length === patients.length) {
      return { success: false, error: 'Patient not found' };
    }
    
    await writeData("patients", updatedPatients);
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
}

export async function getPatients(clinicId?: string) {
  try {
    const patients = await readData<Patient[]>("patients");
    
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
    const patients = await readData<Patient[]>("patients");
    const patient = patients.find(p => p.id === id);
    
    if (!patient) {
      return null;
    }
    
    // Get appointments for this patient
    const appointments = await readData("appointments");
    const patientAppointments = appointments
      .filter(a => a.patientId === id)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    // Get doctor details for each appointment
    const doctors = await readData("doctors");
    
    const appointmentsWithDoctors = patientAppointments.map((appointment) => {
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      return {
        ...appointment,
        doctor,
        appointmentDate: new Date(appointment.appointmentDate)
      };
    });
    
    // Get prescriptions for this patient
    const prescriptions = await readData("prescriptions");
    const patientPrescriptions = prescriptions
      .filter(p => p.patientId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      ...patient,
      appointments: appointmentsWithDoctors,
      prescriptions: patientPrescriptions
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}