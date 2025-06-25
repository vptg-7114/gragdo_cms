"use server";

import { findById, readData, createItem, updateItem, deleteItem } from "@/lib/db";

// Define the doctor interface
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
  clinicId: string;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export async function createDoctor(data: {
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  clinicId: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    const doctor = await createItem<Doctor>("doctors", {
      ...data,
      isAvailable: true,
      createdAt: now,
      updatedAt: now
    });

    return { success: true, doctor };
  } catch (error) {
    console.error('Error creating doctor:', error);
    return { success: false, error: 'Failed to create doctor' };
  }
}

export async function updateDoctor(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable?: boolean;
}) {
  try {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const doctor = await updateItem<Doctor>("doctors", id, updatedData);
    
    if (!doctor) {
      return { success: false, error: 'Doctor not found' };
    }
    
    return { success: true, doctor };
  } catch (error) {
    console.error('Error updating doctor:', error);
    return { success: false, error: 'Failed to update doctor' };
  }
}

export async function deleteDoctor(id: string) {
  try {
    const success = await deleteItem<Doctor>("doctors", id);
    
    if (!success) {
      return { success: false, error: 'Doctor not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return { success: false, error: 'Failed to delete doctor' };
  }
}

export async function getDoctors(clinicId?: string) {
  try {
    const doctors = await readData<Doctor>("doctors");
    
    // Filter by clinicId if provided
    const filteredDoctors = clinicId 
      ? doctors.filter(d => d.clinicId === clinicId)
      : doctors;
    
    // Get schedules and appointments for each doctor
    const doctorsWithDetails = await Promise.all(
      filteredDoctors.map(async (doctor) => {
        const schedules = await readData<any>("doctor_schedules");
        const appointments = await readData<any>("appointments");
        
        const doctorSchedules = schedules.filter(s => s.doctorId === doctor.id);
        
        // Only include future appointments
        const now = new Date();
        const doctorAppointments = appointments
          .filter(a => a.doctorId === doctor.id && new Date(a.appointmentDate) >= now);
        
        return {
          ...doctor,
          schedules: doctorSchedules,
          appointments: doctorAppointments
        };
      })
    );
    
    // Sort by name in ascending order
    return doctorsWithDetails.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctor = await findById<Doctor>("doctors", id);
    
    if (!doctor) {
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
    
    // Get schedules and appointments for this doctor
    const schedules = await readData<any>("doctor_schedules");
    const appointments = await readData<any>("appointments");
    
    const doctorSchedules = schedules.filter(s => s.doctorId === id);
    const doctorAppointments = appointments.filter(a => a.doctorId === id);
    
    // Get patient details for each appointment
    const appointmentsWithPatients = await Promise.all(
      doctorAppointments.map(async (appointment) => {
        const patient = await findById("patients", appointment.patientId);
        return {
          ...appointment,
          patient,
          appointmentDate: new Date(appointment.appointmentDate)
        };
      })
    );
    
    // Sort appointments by date in descending order
    const sortedAppointments = appointmentsWithPatients.sort((a, b) => 
      b.appointmentDate.getTime() - a.appointmentDate.getTime()
    );
    
    return {
      ...doctor,
      schedules: doctorSchedules,
      appointments: sortedAppointments
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