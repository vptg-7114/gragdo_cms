import { readData } from '@/lib/db';

export async function getDashboardStats() {
  try {
    const appointments = await readData('appointments.json');
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayCheckIns = appointments.filter(
      appointment => 
        new Date(appointment.appointmentDate) >= today &&
        new Date(appointment.appointmentDate) < tomorrow &&
        appointment.status === 'COMPLETED'
    ).length;
    
    const availableDoctors = doctors.filter(
      doctor => doctor.isAvailable
    ).length;
    
    return {
      appointments: appointments.length,
      totalPatients: patients.length,
      checkIns: todayCheckIns,
      availableDoctors
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      appointments: 0,
      totalPatients: 0,
      checkIns: 0,
      availableDoctors: 0
    };
  }
}

export async function getRecentAppointments() {
  try {
    const appointments = await readData('appointments.json');
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    // Get 5 most recent appointments
    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
      .slice(0, 5);
    
    // Add patient and doctor details
    return recentAppointments.map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      
      return {
        ...appointment,
        patient: patient ? {
          patientId: patient.patientId,
          name: patient.name,
          phone: patient.phone,
          gender: patient.gender,
          age: patient.age
        } : null,
        doctor: doctor ? {
          name: doctor.name
        } : null
      };
    });
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return [];
  }
}

export async function getDoctorsActivity() {
  try {
    const doctors = await readData('doctors.json');
    const appointments = await readData('appointments.json');
    
    return doctors.map(doctor => {
      const doctorAppointments = appointments.filter(a => a.doctorId === doctor.id);
      
      const inProgress = doctorAppointments.filter(a => a.status === 'IN_PROGRESS').length;
      const completed = doctorAppointments.filter(a => a.status === 'COMPLETED').length;
      const pending = doctorAppointments.filter(a => a.status === 'PENDING').length;
      
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
  } catch (error) {
    console.error('Error fetching doctors activity:', error);
    return [];
  }
}

export async function getRecentReports() {
  try {
    // Mock data for recent reports
    const reports = [
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
      },
      {
        id: '5',
        title: 'Inventory Status Report',
        type: 'Inventory Management',
        generatedDate: new Date('2024-01-03'),
        size: '2.1 MB',
        format: 'Excel'
      }
    ];
    
    return reports;
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return [];
  }
}