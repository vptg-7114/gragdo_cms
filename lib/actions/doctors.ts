import { 
  readData, 
  findById, 
  createItem, 
  updateItem, 
  deleteItem,
  findByField
} from '@/lib/db';

export async function createDoctor(data: {
  name: string
  email?: string
  phone: string
  specialization: string
  qualification?: string
  experience?: number
  consultationFee?: number
  clinicId: string
  createdById: string
}) {
  try {
    const doctor = await createItem('doctors.json', {
      ...data,
      isAvailable: true
    });
    return { success: true, doctor };
  } catch (error) {
    console.error('Error creating doctor:', error);
    return { success: false, error: 'Failed to create doctor' };
  }
}

export async function updateDoctor(id: string, data: {
  name?: string
  email?: string
  phone?: string
  specialization?: string
  qualification?: string
  experience?: number
  consultationFee?: number
  isAvailable?: boolean
}) {
  try {
    const doctor = await updateItem('doctors.json', id, data);
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
    const success = await deleteItem('doctors.json', id);
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
    const doctors = await readData('doctors.json');
    const schedules = await readData('doctor-schedules.json');
    const appointments = await readData('appointments.json');
    
    // Filter by clinic if clinicId is provided
    const filteredDoctors = clinicId 
      ? doctors.filter(doctor => doctor.clinicId === clinicId)
      : doctors;
    
    // Add schedules and appointments to each doctor
    const doctorsWithRelations = filteredDoctors.map(doctor => {
      const doctorSchedules = schedules.filter(schedule => schedule.doctorId === doctor.id);
      const doctorAppointments = appointments.filter(
        appointment => appointment.doctorId === doctor.id && 
        new Date(appointment.appointmentDate) >= new Date()
      );
      
      return {
        ...doctor,
        schedules: doctorSchedules,
        appointments: doctorAppointments
      };
    });
    
    return doctorsWithRelations;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctor = await findById('doctors.json', id);
    if (!doctor) return null;
    
    const schedules = await readData('doctor-schedules.json');
    const appointments = await readData('appointments.json');
    const patients = await readData('patients.json');
    
    const doctorSchedules = schedules.filter(schedule => schedule.doctorId === id);
    const doctorAppointments = appointments.filter(appointment => appointment.doctorId === id);
    
    // Add patient details to appointments
    const appointmentsWithPatients = doctorAppointments.map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      return {
        ...appointment,
        patient: patient || null
      };
    });
    
    return {
      ...doctor,
      schedules: doctorSchedules,
      appointments: appointmentsWithPatients
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