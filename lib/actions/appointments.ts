import { 
  readData, 
  findById, 
  createItem, 
  updateItem, 
  deleteItem,
  AppointmentStatus
} from '@/lib/db';

export async function createAppointment(data: {
  patientId: string
  doctorId: string
  clinicId: string
  appointmentDate: Date
  concern: string
  notes?: string
  createdById: string
}) {
  try {
    const appointment = await createItem('appointments.json', {
      ...data,
      status: 'PENDING' as AppointmentStatus,
      duration: 30
    });
    
    // Get patient and doctor details
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    const patient = patients.find(p => p.id === data.patientId);
    const doctor = doctors.find(d => d.id === data.doctorId);
    
    return { 
      success: true, 
      appointment: {
        ...appointment,
        appointmentDate: new Date(appointment.appointmentDate),
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
  appointmentDate?: Date
  concern?: string
  notes?: string
  status?: AppointmentStatus
}) {
  try {
    const appointment = await updateItem('appointments.json', id, data);
    if (!appointment) {
      return { success: false, error: 'Appointment not found' };
    }
    
    // Get patient and doctor details
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    return { 
      success: true, 
      appointment: {
        ...appointment,
        appointmentDate: new Date(appointment.appointmentDate),
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
    const success = await deleteItem('appointments.json', id);
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
    const appointments = await readData('appointments.json');
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    // Filter by clinic if clinicId is provided
    const filteredAppointments = clinicId 
      ? appointments.filter(appointment => appointment.clinicId === clinicId)
      : appointments;
    
    // Add patient and doctor details to each appointment
    const appointmentsWithDetails = filteredAppointments.map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      
      return {
        ...appointment,
        appointmentDate: new Date(appointment.appointmentDate),
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
    
    // Sort by appointment date (descending)
    return appointmentsWithDetails.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}