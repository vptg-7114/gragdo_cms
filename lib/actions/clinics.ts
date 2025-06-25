import { 
  readData, 
  findById, 
  createItem, 
  updateItem, 
  deleteItem 
} from '@/lib/db';

export async function createClinic(data: {
  name: string
  address: string
  phone: string
  email?: string
  description?: string
  createdById: string
}) {
  try {
    const clinic = await createItem('clinics.json', data);
    return { success: true, clinic };
  } catch (error) {
    console.error('Error creating clinic:', error);
    return { success: false, error: 'Failed to create clinic' };
  }
}

export async function updateClinic(id: string, data: {
  name?: string
  address?: string
  phone?: string
  email?: string
  description?: string
}) {
  try {
    const clinic = await updateItem('clinics.json', id, data);
    if (!clinic) {
      return { success: false, error: 'Clinic not found' };
    }
    return { success: true, clinic };
  } catch (error) {
    console.error('Error updating clinic:', error);
    return { success: false, error: 'Failed to update clinic' };
  }
}

export async function deleteClinic(id: string) {
  try {
    const success = await deleteItem('clinics.json', id);
    if (!success) {
      return { success: false, error: 'Clinic not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting clinic:', error);
    return { success: false, error: 'Failed to delete clinic' };
  }
}

export async function getClinics() {
  try {
    const clinics = await readData('clinics.json');
    
    // Add stats to each clinic
    const clinicsWithStats = await Promise.all(
      clinics.map(async (clinic) => {
        const patients = await readData('patients.json');
        const appointments = await readData('appointments.json');
        const doctors = await readData('doctors.json');
        
        const clinicPatients = patients.filter(p => p.clinicId === clinic.id);
        const clinicAppointments = appointments.filter(a => a.clinicId === clinic.id);
        const clinicDoctors = doctors.filter(d => d.clinicId === clinic.id);
        
        return {
          ...clinic,
          stats: {
            patients: clinicPatients.length,
            appointments: clinicAppointments.length,
            doctors: clinicDoctors.length
          }
        };
      })
    );
    
    return clinicsWithStats;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }
}

export async function getClinicById(id: string) {
  try {
    const clinic = await findById('clinics.json', id);
    return clinic;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return null;
  }
}