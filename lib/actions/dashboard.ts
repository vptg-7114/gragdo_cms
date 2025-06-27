'use server'

import { readData, getRelatedData } from '@/lib/db';
import { Gender, Appointment, Patient, Doctor, User } from '@/lib/types';

export async function getDashboardStats(clinicId?: string, doctorId?: string) {
  try {
    const appointments = await readData<Appointment[]>('appointments', []);
    const patients = await readData<Patient[]>('patients', []);
    const doctors = await readData<Doctor[]>('doctors', []);
    
    // Filter by clinicId if provided
    const clinicAppointments = clinicId 
      ? appointments.filter(a => a.clinicId === clinicId)
      : appointments;
    
    const clinicPatients = clinicId 
      ? patients.filter(p => p.clinicId === clinicId)
      : patients;
    
    const clinicDoctors = clinicId 
      ? doctors.filter(d => d.clinicId === clinicId)
      : doctors;
    
    // Further filter by doctorId if provided
    const filteredAppointments = doctorId 
      ? clinicAppointments.filter(a => a.doctorId === doctorId)
      : clinicAppointments;
    
    // Get today's appointments and patients
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= today && appointmentDate < tomorrow;
    });

    const todayPatientIds = new Set(todayAppointments.map(a => a.patientId));
    const todayPatients = todayPatientIds.size;

    // Get patient demographics
    const malePatients = clinicPatients.filter(p => p.gender === Gender.MALE).length;
    const femalePatients = clinicPatients.filter(p => p.gender === Gender.FEMALE).length;
    const childPatients = clinicPatients.filter(p => p.age < 18).length;

    // Get available doctors
    const availableDoctors = clinicDoctors.filter(d => d.isAvailable).length;

    // Get check-ins (patients who have arrived for their appointments)
    // For demo purposes, we'll use a percentage of today's appointments
    const checkIns = Math.floor(todayAppointments.length * 0.7);

    return {
      todayAppointments: todayAppointments.length,
      todayPatients,
      totalPatients: clinicPatients.length,
      malePatients,
      femalePatients,
      childPatients,
      availableDoctors,
      checkIns,
      appointments: todayAppointments.length // For StatsCards component
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      todayAppointments: 0,
      todayPatients: 0,
      totalPatients: 0,
      malePatients: 0,
      femalePatients: 0,
      childPatients: 0,
      availableDoctors: 0,
      checkIns: 0,
      appointments: 0
    };
  }
}

export async function getRecentAppointments(clinicId?: string, doctorId?: string) {
  try {
    const appointments = await readData<Appointment[]>('appointments', []);
    const patients = await readData<Patient[]>('patients', []);
    const doctors = await readData<Doctor[]>('doctors', []);
    
    // Filter by clinicId if provided
    let filteredAppointments = clinicId 
      ? appointments.filter(a => a.clinicId === clinicId)
      : appointments;
    
    // Further filter by doctorId if provided
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(a => a.doctorId === doctorId);
    }
    
    // Sort by date descending and take the first 5
    const recentAppointments = filteredAppointments
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
      .slice(0, 5)
      .map(appointment => {
        // Find the corresponding patient and doctor
        const patient = patients.find(p => p.id === appointment.patientId);
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        
        return {
          ...appointment,
          appointmentDate: new Date(appointment.appointmentDate),
          patient: patient || { id: appointment.patientId, name: 'Unknown Patient', patientId: 'Unknown' },
          doctor: doctor || { id: appointment.doctorId, name: 'Unknown Doctor' }
        };
      });
      
    return recentAppointments;
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return [];
  }
}

export async function getDoctorsActivity(clinicId?: string) {
  try {
    const doctors = await readData<Doctor[]>('doctors', []);
    const appointments = await readData<Appointment[]>('appointments', []);
    
    // Filter by clinicId if provided
    const clinicDoctors = clinicId 
      ? doctors.filter(d => d.clinicId === clinicId)
      : doctors;
    
    const clinicAppointments = clinicId 
      ? appointments.filter(a => a.clinicId === clinicId)
      : appointments;
    
    const doctorsActivity = clinicDoctors.map(doctor => {
      const doctorAppointments = clinicAppointments.filter(apt => apt.doctorId === doctor.id);
      const inProgress = doctorAppointments.filter(apt => apt.status === 'IN_PROGRESS').length;
      const completed = doctorAppointments.filter(apt => apt.status === 'COMPLETED').length;
      const pending = doctorAppointments.filter(apt => apt.status === 'PENDING').length;

      return {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        isAvailable: doctor.isAvailable,
        appointments: {
          inProgress,
          completed,
          pending,
          total: doctorAppointments.length
        }
      };
    });

    return doctorsActivity;
  } catch (error) {
    console.error('Error fetching doctors activity:', error);
    return [];
  }
}

export async function getRecentReports(clinicId?: string) {
  try {
    // In a real app, you would fetch reports from the database
    // For demo purposes, we'll return mock data
    return [
      {
        id: '1',
        title: 'Monthly Patient Report',
        type: 'Patient Analytics',
        generatedDate: new Date('2024-01-15'),
        size: '2.4 MB',
        format: 'PDF'
      },
      {
        id: '2',
        title: 'Revenue Analysis Q4',
        type: 'Financial Report',
        generatedDate: new Date('2024-01-10'),
        size: '1.8 MB',
        format: 'Excel'
      },
      {
        id: '3',
        title: 'Doctor Performance Report',
        type: 'Performance Analytics',
        generatedDate: new Date('2024-01-08'),
        size: '3.2 MB',
        format: 'PDF'
      },
      {
        id: '4',
        title: 'Appointment Statistics',
        type: 'Operational Report',
        generatedDate: new Date('2024-01-05'),
        size: '1.5 MB',
        format: 'PDF'
      }
    ];
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return [];
  }
}