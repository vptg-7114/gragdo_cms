'use server'

import { readData, writeData } from '@/lib/db';

interface Appointment {
  id: string;
  patient: {
    patientId: string;
    name: string;
    phone: string;
    gender: string;
    age: number;
  };
  doctor: {
    name: string;
  };
  appointmentDate: string; // Store as ISO string
  duration: number;
  concern: string;
  status: string;
}

export async function getAppointments() {
  try {
    const appointments = await readData<Appointment[]>('appointments', []);
    
    // Convert string dates to Date objects for the client
    return appointments.map(appointment => ({
      ...appointment,
      appointmentDate: new Date(appointment.appointmentDate)
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function deleteAppointment(id: string) {
  try {
    const appointments = await readData<Appointment[]>('appointments', []);
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    await writeData('appointments', updatedAppointments);
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
}