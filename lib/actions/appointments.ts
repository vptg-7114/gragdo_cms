"use server";

import { findById, readData, createItem, updateItem, deleteItem } from "@/lib/db";

// Define the appointment status enum
export enum AppointmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Define the appointment interface
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: string; // ISO string
  duration: number;
  concern: string;
  notes?: string;
  status: AppointmentStatus;
  createdById: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export async function createAppointment(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: Date;
  concern: string;
  notes?: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    const appointment = await createItem<Appointment>("appointments", {
      ...data,
      appointmentDate: data.appointmentDate.toISOString(),
      status: AppointmentStatus.PENDING,
      duration: 30,
      createdAt: now,
      updatedAt: now
    });

    // Get patient and doctor details for the response
    const patient = await findById("patients", data.patientId);
    const doctor = await findById("doctors", data.doctorId);

    return { 
      success: true, 
      appointment: {
        ...appointment,
        patient,
        doctor
      }
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: 'Failed to create appointment' };
  }
}

export async function updateAppointment(id: string, data: {
  appointmentDate?: Date;
  concern?: string;
  notes?: string;
  status?: AppointmentStatus;
}) {
  try {
    const appointment = await findById<Appointment>("appointments", id);
    
    if (!appointment) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedData: Partial<Appointment> = {
      ...data,
      appointmentDate: data.appointmentDate ? data.appointmentDate.toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    
    const updatedAppointment = await updateItem<Appointment>("appointments", id, updatedData);
    
    if (!updatedAppointment) {
      return { success: false, error: 'Failed to update appointment' };
    }
    
    // Get patient and doctor details for the response
    const patient = await findById("patients", updatedAppointment.patientId);
    const doctor = await findById("doctors", updatedAppointment.doctorId);

    return { 
      success: true, 
      appointment: {
        ...updatedAppointment,
        patient,
        doctor
      }
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const success = await deleteItem<Appointment>("appointments", id);
    
    if (!success) {
      return { success: false, error: 'Appointment not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
}

export async function getAppointments(clinicId?: string) {
  try {
    const appointments = await readData<Appointment>("appointments");
    
    // Filter by clinicId if provided
    const filteredAppointments = clinicId 
      ? appointments.filter(a => a.clinicId === clinicId)
      : appointments;
    
    // Sort by appointmentDate in descending order
    const sortedAppointments = filteredAppointments.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
    
    // Get patient and doctor details for each appointment
    const appointmentsWithDetails = await Promise.all(
      sortedAppointments.map(async (appointment) => {
        const patient = await findById("patients", appointment.patientId);
        const doctor = await findById("doctors", appointment.doctorId);
        
        return {
          ...appointment,
          patient,
          doctor,
          appointmentDate: new Date(appointment.appointmentDate)
        };
      })
    );
    
    return appointmentsWithDetails;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}