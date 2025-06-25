import { 
  readData, 
  findById, 
  createItem, 
  updateItem, 
  deleteItem,
  generateId,
  Gender
} from '@/lib/db';

export async function createPatient(data: {
  name: string
  email?: string
  phone: string
  gender: Gender
  age: number
  address?: string
  medicalHistory?: string
  allergies?: string
  clinicId: string
  createdById: string
}) {
  try {
    const patientId = generateId();
    
    const patient = await createItem('patients.json', {
      ...data,
      patientId
    });
    
    return { success: true, patient };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Failed to create patient' };
  }
}

export async function updatePatient(id: string, data: {
  name?: string
  email?: string
  phone?: string
  gender?: Gender
  age?: number
  address?: string
  medicalHistory?: string
  allergies?: string
}) {
  try {
    const patient = await updateItem('patients.json', id, data);
    if (!patient) {
      return { success: false, error: 'Patient not found' };
    }
    return { success: true, patient };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Failed to update patient' };
  }
}

export async function deletePatient(id: string) {
  try {
    const success = await deleteItem('patients.json', id);
    if (!success) {
      return { success: false, error: 'Patient not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
}

export async function getPatients(clinicId?: string) {
  try {
    const patients = await readData('patients.json');
    
    // Filter by clinic if clinicId is provided
    const filteredPatients = clinicId 
      ? patients.filter(patient => patient.clinicId === clinicId)
      : patients;
    
    // Sort by creation date (descending)
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
    const patient = await findById('patients.json', id);
    if (!patient) return null;
    
    const appointments = await readData('appointments.json');
    const doctors = await readData('doctors.json');
    
    // Get patient's appointments
    const patientAppointments = appointments.filter(a => a.patientId === id);
    
    // Add doctor details to appointments
    const appointmentsWithDoctors = patientAppointments.map(appointment => {
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      return {
        ...appointment,
        doctor: doctor || null
      };
    });
    
    // Sort appointments by date (descending)
    const sortedAppointments = appointmentsWithDoctors.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
    
    return {
      ...patient,
      appointments: sortedAppointments
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}