"use server";

import { readData, writeData, findById } from "@/lib/db";
import { AppointmentStatus, AppointmentType, Appointment } from "@/lib/models";
import { createAppointment } from "@/lib/models";

interface AppointmentWithDetails extends Appointment {
  patient?: {
    id: string;
    patientId: string;
    name: string;
    phone: string;
    gender: string;
    age: number;
  };
  doctor?: {
    id: string;
    name: string;
  };
}

export async function createAppointmentRecord(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: AppointmentType;
  concern: string;
  notes?: string;
  isFollowUp: boolean;
  previousAppointmentId?: string;
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    // Generate a unique appointment ID
    const appointmentId = `APT${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create appointment object
    const newAppointment = createAppointment({
      patientId: data.patientId,
      doctorId: data.doctorId,
      clinicId: data.clinicId,
      appointmentDate: data.appointmentDate,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      type: data.type,
      concern: data.concern,
      notes: data.notes,
      status: AppointmentStatus.SCHEDULED,
      isFollowUp: data.isFollowUp,
      previousAppointmentId: data.previousAppointmentId,
      createdById: data.createdById,
      appointmentId,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    const appointments = await readData<Appointment[]>("appointments", []);
    appointments.push(newAppointment as any);
    await writeData("appointments", appointments);

    // Get patient and doctor details for the response
    const patients = await readData("patients", []);
    const doctors = await readData("doctors", []);
    
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

export async function updateAppointmentRecord(id: string, data: {
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  type?: AppointmentType;
  concern?: string;
  notes?: string;
  status?: AppointmentStatus;
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  followUpDate?: string;
}) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...updatedData
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    // Get patient and doctor details for the response
    const patients = await readData("patients", []);
    const doctors = await readData("doctors", []);
    
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

export async function cancelAppointment(id: string, data: {
  cancelledById: string;
  cancelReason: string;
}) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const now = new Date().toISOString();
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      status: AppointmentStatus.CANCELLED,
      cancelledAt: now,
      cancelledById: data.cancelledById,
      cancelReason: data.cancelReason,
      updatedAt: now
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { success: false, error: 'Failed to cancel appointment' };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
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

export async function getAppointments(clinicId?: string, doctorId?: string, patientId?: string, status?: AppointmentStatus) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    
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
    
    if (status) {
      filteredAppointments = filteredAppointments.filter(a => a.status === status);
    }
    
    // Sort by appointmentDate in descending order
    const sortedAppointments = filteredAppointments.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
    
    // Get patient and doctor details for each appointment
    const patients = await readData("patients", []);
    const doctors = await readData("doctors", []);
    
    const appointmentsWithDetails = sortedAppointments.map((appointment) => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      
      return {
        ...appointment,
        patient: patient ? {
          id: patient.id,
          patientId: patient.patientId,
          name: `${patient.firstName} ${patient.lastName}`,
          phone: patient.phone,
          gender: patient.gender,
          age: patient.age
        } : undefined,
        doctor: doctor ? {
          id: doctor.id,
          name: doctor.name
        } : undefined
      };
    });
    
    return appointmentsWithDetails as AppointmentWithDetails[];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function getAppointmentById(id: string) {
  try {
    const appointment = await findById<Appointment>("appointments", id);
    
    if (!appointment) {
      return null;
    }
    
    // Get patient and doctor details
    const patients = await readData("patients", []);
    const doctors = await readData("doctors", []);
    
    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    return {
      ...appointment,
      patient: patient ? {
        id: patient.id,
        patientId: patient.patientId,
        name: `${patient.firstName} ${patient.lastName}`,
        phone: patient.phone,
        gender: patient.gender,
        age: patient.age
      } : undefined,
      doctor: doctor ? {
        id: doctor.id,
        name: doctor.name
      } : undefined
    } as AppointmentWithDetails;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
}

export async function checkInAppointment(id: string) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      status: AppointmentStatus.CHECKED_IN,
      updatedAt: new Date().toISOString()
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error('Error checking in appointment:', error);
    return { success: false, error: 'Failed to check in appointment' };
  }
}

export async function startAppointment(id: string) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      status: AppointmentStatus.IN_PROGRESS,
      updatedAt: new Date().toISOString()
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error('Error starting appointment:', error);
    return { success: false, error: 'Failed to start appointment' };
  }
}

export async function completeAppointment(id: string, data: {
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  notes?: string;
  followUpDate?: string;
}) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      status: AppointmentStatus.COMPLETED,
      vitals: data.vitals,
      notes: data.notes || appointments[appointmentIndex].notes,
      followUpDate: data.followUpDate,
      updatedAt: new Date().toISOString()
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error('Error completing appointment:', error);
    return { success: false, error: 'Failed to complete appointment' };
  }
}

export async function rescheduleAppointment(id: string, data: {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
}) {
  try {
    const appointments = await readData<Appointment[]>("appointments", []);
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return { success: false, error: 'Appointment not found' };
    }
    
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      appointmentDate: data.appointmentDate,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      status: AppointmentStatus.RESCHEDULED,
      updatedAt: new Date().toISOString()
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    await writeData("appointments", appointments);
    
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return { success: false, error: 'Failed to reschedule appointment' };
  }
}