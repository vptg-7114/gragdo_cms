'use server'

import { readData, writeData, findById } from '@/lib/db';
import { Prescription, Patient, Doctor, DocumentType } from '@/lib/models';
import { createPrescription } from '@/lib/models';
import { uploadFile, deleteFile, generateFileKey } from '@/lib/services/s3';

export async function createPrescriptionRecord(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentId: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    medicineId?: string;
    quantity: number;
  }[];
  instructions?: string;
  followUpDate?: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
  createdById: string;
}) {
  try {
    const now = new Date().toISOString();
    
    // Generate a unique prescription ID
    const prescriptionId = `PRE${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Process document if provided
    let documentUrl;
    if (data.document) {
      const key = generateFileKey('prescriptions', `prescription_${prescriptionId}.pdf`);
      documentUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    // Create prescription object
    const newPrescription = createPrescription({
      patientId: data.patientId,
      doctorId: data.doctorId,
      clinicId: data.clinicId,
      appointmentId: data.appointmentId,
      diagnosis: data.diagnosis,
      medications: data.medications.map(med => ({
        id: `med-${Math.random().toString(36).substring(2, 10)}`,
        ...med
      })),
      instructions: data.instructions,
      followUpDate: data.followUpDate,
      documentUrl,
      prescriptionId,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
    
    // Save to database
    const prescriptions = await readData<Prescription[]>("prescriptions", []);
    prescriptions.push(newPrescription as any);
    await writeData("prescriptions", prescriptions);
    
    // If document was uploaded, also save it as a patient document
    if (documentUrl) {
      const patients = await readData("patients", []);
      const patientIndex = patients.findIndex(p => p.id === data.patientId);
      
      if (patientIndex !== -1) {
        const patient = patients[patientIndex];
        const documents = [...(patient.documents || [])];
        
        documents.push({
          id: `doc-${Math.random().toString(36).substring(2, 10)}`,
          documentId: `DOC${Math.floor(100000 + Math.random() * 900000)}`,
          name: `Prescription_${prescriptionId}.pdf`,
          type: DocumentType.PRESCRIPTION,
          url: documentUrl,
          size: data.document.file.length,
          patientId: data.patientId,
          appointmentId: data.appointmentId,
          uploadedById: data.createdById,
          clinicId: data.clinicId,
          createdAt: now,
          updatedAt: now
        });
        
        patients[patientIndex] = {
          ...patient,
          documents,
          updatedAt: now
        };
        
        await writeData("patients", patients);
      }
    }

    return { success: true, prescription: newPrescription };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
}

export async function updatePrescriptionRecord(id: string, data: {
  diagnosis?: string;
  medications?: {
    id?: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    medicineId?: string;
    quantity: number;
  }[];
  instructions?: string;
  followUpDate?: string;
  isActive?: boolean;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const prescriptions = await readData<Prescription[]>("prescriptions", []);
    const prescriptionIndex = prescriptions.findIndex(p => p.id === id);
    
    if (prescriptionIndex === -1) {
      return { success: false, error: 'Prescription not found' };
    }
    
    const now = new Date().toISOString();
    
    // Process document if provided
    let documentUrl = prescriptions[prescriptionIndex].documentUrl;
    if (data.document) {
      // Delete old document if it exists
      if (documentUrl) {
        try {
          const urlParts = new URL(documentUrl);
          const key = urlParts.pathname.substring(1); // Remove leading slash
          await deleteFile(key);
        } catch (error) {
          console.error('Error deleting old prescription document:', error);
          // Continue even if deletion fails
        }
      }
      
      // Upload new document
      const key = generateFileKey('prescriptions', `prescription_${prescriptions[prescriptionIndex].prescriptionId}.pdf`);
      documentUrl = await uploadFile(data.document.file, key, data.document.contentType);
    }
    
    // Process medications
    let medications = prescriptions[prescriptionIndex].medications;
    if (data.medications) {
      medications = data.medications.map(med => ({
        id: med.id || `med-${Math.random().toString(36).substring(2, 10)}`,
        ...med
      }));
    }
    
    const updatedData = {
      ...data,
      medications,
      documentUrl,
      updatedAt: now
    };
    
    const updatedPrescription = {
      ...prescriptions[prescriptionIndex],
      ...updatedData
    };
    
    prescriptions[prescriptionIndex] = updatedPrescription;
    await writeData("prescriptions", prescriptions);
    
    // If document was updated, also update it in patient documents
    if (data.document && documentUrl) {
      const patients = await readData("patients", []);
      const patientIndex = patients.findIndex(p => p.id === updatedPrescription.patientId);
      
      if (patientIndex !== -1) {
        const patient = patients[patientIndex];
        let documents = [...(patient.documents || [])];
        
        // Find existing document for this prescription
        const docIndex = documents.findIndex(d => 
          d.type === DocumentType.PRESCRIPTION && 
          d.name.includes(updatedPrescription.prescriptionId)
        );
        
        if (docIndex !== -1) {
          // Update existing document
          documents[docIndex] = {
            ...documents[docIndex],
            url: documentUrl,
            size: data.document.file.length,
            updatedAt: now
          };
        } else {
          // Add new document
          documents.push({
            id: `doc-${Math.random().toString(36).substring(2, 10)}`,
            documentId: `DOC${Math.floor(100000 + Math.random() * 900000)}`,
            name: `Prescription_${updatedPrescription.prescriptionId}.pdf`,
            type: DocumentType.PRESCRIPTION,
            url: documentUrl,
            size: data.document.file.length,
            patientId: updatedPrescription.patientId,
            appointmentId: updatedPrescription.appointmentId,
            uploadedById: patient.createdById,
            clinicId: updatedPrescription.clinicId,
            createdAt: now,
            updatedAt: now
          });
        }
        
        patients[patientIndex] = {
          ...patient,
          documents,
          updatedAt: now
        };
        
        await writeData("patients", patients);
      }
    }
    
    return { success: true, prescription: updatedPrescription };
  } catch (error) {
    console.error('Error updating prescription:', error);
    return { success: false, error: 'Failed to update prescription' };
  }
}

export async function deletePrescriptionRecord(id: string) {
  try {
    const prescriptions = await readData<Prescription[]>("prescriptions", []);
    const prescription = prescriptions.find(p => p.id === id);
    
    if (!prescription) {
      return { success: false, error: 'Prescription not found' };
    }
    
    // Delete document from S3 if it exists
    if (prescription.documentUrl) {
      try {
        const urlParts = new URL(prescription.documentUrl);
        const key = urlParts.pathname.substring(1); // Remove leading slash
        await deleteFile(key);
      } catch (error) {
        console.error('Error deleting prescription document:', error);
        // Continue even if deletion fails
      }
    }
    
    // Remove prescription from database
    const updatedPrescriptions = prescriptions.filter(p => p.id !== id);
    await writeData("prescriptions", updatedPrescriptions);
    
    // Also remove the document from patient documents
    if (prescription.documentUrl) {
      const patients = await readData("patients", []);
      const patientIndex = patients.findIndex(p => p.id === prescription.patientId);
      
      if (patientIndex !== -1) {
        const patient = patients[patientIndex];
        const documents = (patient.documents || []).filter(d => 
          !(d.type === DocumentType.PRESCRIPTION && d.name.includes(prescription.prescriptionId))
        );
        
        patients[patientIndex] = {
          ...patient,
          documents,
          updatedAt: new Date().toISOString()
        };
        
        await writeData("patients", patients);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return { success: false, error: 'Failed to delete prescription' };
  }
}

export async function getPrescriptions(clinicId?: string, doctorId?: string, patientId?: string) {
  try {
    const prescriptions = await readData<Prescription[]>("prescriptions", []);
    
    // Filter prescriptions if parameters are provided
    let filteredPrescriptions = prescriptions;
    
    if (clinicId) {
      filteredPrescriptions = filteredPrescriptions.filter(p => p.clinicId === clinicId);
    }
    
    if (doctorId) {
      filteredPrescriptions = filteredPrescriptions.filter(p => p.doctorId === doctorId);
    }
    
    if (patientId) {
      filteredPrescriptions = filteredPrescriptions.filter(p => p.patientId === patientId);
    }
    
    // Enrich prescriptions with patient and doctor data
    const patients = await readData("patients", []);
    const doctors = await readData("doctors", []);
    
    const enrichedPrescriptions = filteredPrescriptions.map(prescription => {
      const patient = patients.find(p => p.id === prescription.patientId);
      const doctor = doctors.find(d => d.id === prescription.doctorId);
      
      return {
        ...prescription,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
        doctorName: doctor?.name || 'Unknown Doctor',
        patientGender: patient?.gender || 'UNKNOWN',
        patientAge: patient?.age || 0
      };
    });
    
    // Sort by createdAt in descending order
    return enrichedPrescriptions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return [];
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const prescription = await findById<Prescription>("prescriptions", id);
    
    if (!prescription) {
      return null;
    }
    
    // Get patient and doctor details
    const patient = await findById("patients", prescription.patientId);
    const doctor = await findById("doctors", prescription.doctorId);
    
    // Get appointment details
    const appointment = await findById("appointments", prescription.appointmentId);
    
    return {
      ...prescription,
      patient,
      doctor,
      appointment
    };
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}