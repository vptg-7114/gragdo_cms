'use server'

import { readData } from '@/lib/db';

export async function getAdminDashboardStats(clinicId: string) {
  try {
    const patients = await readData('patients', []);
    const appointments = await readData('appointments', []);
    const doctors = await readData('doctors', []);
    const users = await readData('users', []);
    
    // Filter by clinicId
    const clinicPatients = patients.filter(p => p.clinicId === clinicId);
    const clinicAppointments = appointments.filter(a => a.clinicId === clinicId);
    const clinicDoctors = doctors.filter(d => d.clinicId === clinicId);
    const clinicStaff = users.filter(u => u.clinicId === clinicId && u.role === 'STAFF');
    
    return {
      totalPatients: clinicPatients.length,
      appointments: clinicAppointments.length,
      doctors: clinicDoctors.length,
      staff: clinicStaff.length
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return {
      totalPatients: 0,
      appointments: 0,
      doctors: 0,
      staff: 0
    };
  }
}

export async function getAdminDoctors(clinicId: string) {
  try {
    const doctors = await readData('doctors', []);
    
    // Filter by clinicId
    const clinicDoctors = doctors.filter(d => d.clinicId === clinicId);
    
    // Format for display
    return clinicDoctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      isAvailable: doctor.isAvailable,
      avatar: undefined // Add avatar field to Doctor model if needed
    }));
  } catch (error) {
    console.error('Error fetching admin doctors:', error);
    return [];
  }
}

export async function getAdminStaff(clinicId: string) {
  try {
    const users = await readData('users', []);
    
    // Filter by clinicId and role
    const clinicStaff = users.filter(u => u.clinicId === clinicId && u.role === 'STAFF');
    
    // Format for display
    return clinicStaff.map(staff => ({
      id: staff.id,
      name: staff.name,
      role: 'Staff',
      isAvailable: staff.isActive,
      avatar: undefined // Add avatar field to User model if needed
    }));
  } catch (error) {
    console.error('Error fetching admin staff:', error);
    return [];
  }
}

export async function getAdminTransactions(clinicId: string) {
  try {
    const transactions = await readData('transactions', []);
    
    // Filter by clinicId
    const clinicTransactions = transactions.filter(t => t.clinicId === clinicId);
    
    // Sort by date descending and take the first 5
    return clinicTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return [];
  }
}

export async function getAdminAppointments(clinicId: string) {
  try {
    const appointments = await readData('appointments', []);
    const patients = await readData('patients', []);
    
    // Filter by clinicId
    const clinicAppointments = appointments.filter(a => a.clinicId === clinicId);
    
    // Get the most recent 5 appointments
    const recentAppointments = clinicAppointments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Format for display
    return recentAppointments.map((appointment, index) => {
      const patient = patients.find(p => p.id === appointment.patientId);
      
      return {
        id: appointment.id,
        sNo: index + 1,
        name: patient?.name || 'Unknown',
        phoneNumber: patient?.phone || 'N/A',
        email: patient?.email || 'N/A',
        age: patient?.age || 0,
        gender: patient?.gender || 'N/A',
        action: 'Accept'
      };
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return [];
  }
}