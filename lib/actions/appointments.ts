"use server";

import { readData, writeData } from "@/lib/db";
import { AppointmentStatus, Appointment } from "@/lib/types";

export async function createAppointment(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: Date;
  duration: number;
  concern: string;
  notes?: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    const appointments = await readData<Appointment[]>("appointments");
    
    const newAppointment: Appointment = {
      id: `apt-${(appointments.length + 1).toString().padStart(3, '0')}`,
      ...data,
      appointmentDate: data.appointmentDate.toISOString(),
      status: AppointmentStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };
    
    appointments.push(newAppointment);
    await writeData("appointments", appointments);

    // Get patient and doctor details for the response
    const patients = await readData("patients");
    const doctors = await readData("doctors");
    
    const patient = patients.find(p => p.id === data.patientId);
    const doctor = doctors.find(d => d.id === data.doctorId);

    return { 
      success: true, 
      appointment: {
        ...newAppointment,
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
  duration?: number;
  concern?: string;
  notes?: string;
  status?: AppointmentStatus;
}) {
  try {
    const appointments = await readData<Appointment[]>("appointments");
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedData: Partial<Appointment> = {
      ...data,
      appointmentDate: data.appointmentDate ? data.appointmentDate.toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...updatedData
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    // Get patient and doctor details for the response
    const patients = await readData("patients");
    const doctors = await readData("doctors");
    
    const patient = patients.find(p => p.id === updatedAppointment.patientId);
    const doctor = doctors.find(d => d.id === updatedAppointment.doctorId);

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
    const appointments = await readData<Appointment[]>("appointments");
    const updatedAppointments = appointments.filter(a => a.id !== id);
    
    if (updatedAppointments.length === appointments.length) {
      return { success: false, error: 'Appointment not found' };
    }
    
    await writeData("appointments", updatedAppointments);
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
}

export async function getAppointments(clinicId?: string, doctorId?: string, patientId?: string) {
  try {
    const appointments = await readData<Appointment[]>("appointments");
    
    // Apply filters
    let filteredAppointments = appointments;
    
    if (clinicId) {
      filteredAppointments = filteredAppointments.filter(a => a.clinicId === clinicId);
    }
    
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(a => a.doctorId === doctorId);
    }
    
    if (patientId) {
      filteredAppointments = filteredAppointments.filter(a => a.patientId === patientId);
    }
    
    // Sort by appointmentDate in descending order
    const sortedAppointments = filteredAppointments.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
    
    // Get patient and doctor details for each appointment
    const patients = await readData("patients");
    const doctors = await readData("doctors");
    
    const appointmentsWithDetails = sortedAppointments.map((appointment) => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      
      return {
        ...appointment,
        patient,
        doctor,
        appointmentDate: new Date(appointment.appointmentDate)
      };
    });
    
    return appointmentsWithDetails;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function getAppointmentById(id: string) {
  try {
    const appointments = await readData<Appointment[]>("appointments");
    const appointment = appointments.find(a => a.id === id);
    
    if (!appointment) {
      return null;
    }
    
    // Get patient and doctor details
    const patients = await readData("patients");
    const doctors = await readData("doctors");
    
    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    return {
      ...appointment,
      patient,
      doctor,
      appointmentDate: new Date(appointment.appointmentDate)
    };
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
}