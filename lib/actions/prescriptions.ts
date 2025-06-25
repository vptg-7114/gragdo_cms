import { readData, findById, createItem, updateItem, deleteItem } from '@/lib/db';

export async function createPrescription(data: {
  patientId: string
  doctorId: string
  clinicId: string
  concern: string
  diagnosis: string
  medications: string
  instructions?: string
  followUpDate?: Date
  createdById: string
}) {
  try {
    const prescription = await createItem('prescriptions.json', data);
    
    // Get patient and doctor details
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    const patient = patients.find(p => p.id === data.patientId);
    const doctor = doctors.find(d => d.id === data.doctorId);
    
    return { 
      success: true, 
      prescription: {
        ...prescription,
        patient,
        doctor
      }
    };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
}

export async function updatePrescription(id: string, data: {
  concern?: string
  diagnosis?: string
  medications?: string
  instructions?: string
  followUpDate?: Date
}) {
  try {
    const prescription = await updateItem('prescriptions.json', id, data);
    if (!prescription) {
      return { success: false, error: 'Prescription not found' };
    }
    
    // Get patient and doctor details
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    const patient = patients.find(p => p.id === prescription.patientId);
    const doctor = doctors.find(d => d.id === prescription.doctorId);
    
    return { 
      success: true, 
      prescription: {
        ...prescription,
        patient,
        doctor
      }
    };
  } catch (error) {
    console.error('Error updating prescription:', error);
    return { success: false, error: 'Failed to update prescription' };
  }
}

export async function deletePrescription(id: string) {
  try {
    const success = await deleteItem('prescriptions.json', id);
    if (!success) {
      return { success: false, error: 'Prescription not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return { success: false, error: 'Failed to delete prescription' };
  }
}

export async function getPrescriptions(clinicId?: string) {
  try {
    const prescriptions = await readData('prescriptions.json');
    
    // Filter by clinic if clinicId is provided
    return clinicId 
      ? prescriptions.filter(prescription => prescription.clinicId === clinicId)
      : prescriptions;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return [];
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const prescription = await findById('prescriptions.json', id);
    if (!prescription) return null;
    
    // Get patient and doctor details
    const patients = await readData('patients.json');
    const doctors = await readData('doctors.json');
    
    const patient = patients.find(p => p.id === prescription.patientId);
    const doctor = doctors.find(d => d.id === prescription.doctorId);
    
    return {
      ...prescription,
      patient,
      doctor
    };
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}