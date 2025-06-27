"use server";

import { readData, writeData, findById, createRecord, updateRecord, deleteRecord } from "@/lib/db";
import { Gender, Patient } from "@/lib/types";
import { createPatient } from "@/lib/models";
import { uploadFile, deleteFile, generateFileKey } from "@/lib/services/s3";

export async function createPatientRecord(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  medicalHistory?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  clinicId: string;
  createdById: string;
  documents?: {
    name: string;
    type: string;
    file: Buffer;
    contentType: string;
  }[];
}) {
  try {
    const now = new Date().toISOString();
    
    // Calculate age from date of birth
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Generate a unique patient ID with prefix PAT
    const patientId = `PAT${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Process documents if provided
    const processedDocuments = [];
    if (data.documents && data.documents.length > 0) {
      for (const doc of data.documents) {
        const key = generateFileKey('patients', doc.name);
        const url = await uploadFile(doc.file, key, doc.contentType);
        
        processedDocuments.push({
          id: `doc-${Math.random().toString(36).substring(2, 10)}`,
          documentId: `DOC${Math.floor(100000 + Math.random() * 900000)}`,
          name: doc.name,
          type: doc.type,
          url: url,
          size: doc.file.length,
          patientId: '', // Will be updated after patient creation
          uploadedById: data.createdById,
          clinicId: data.clinicId,
          createdAt: now,
          updatedAt: now
        });
      }
    }
    
    // Create patient object
    const newPatient = createPatient({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      age,
      bloodGroup: data.bloodGroup as any,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      medicalHistory: data.medicalHistory,
      allergies: data.allergies,
      emergencyContact: data.emergencyContact,
      clinicId: data.clinicId,
      createdById: data.createdById,
      documents: processedDocuments,
      patientId,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
    
    // Update document patientId references
    if (processedDocuments.length > 0) {
      for (const doc of newPatient.documents) {
        doc.patientId = newPatient.id;
      }
    }
    
    // Save to database
    const patients = await readData<Patient[]>("patients", []);
    patients.push(newPatient as any);
    await writeData("patients", patients);

    return { success: true, patient: newPatient };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Failed to create patient' };
  }
}

export async function updatePatientRecord(id: string, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  medicalHistory?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  isActive?: boolean;
  documents?: {
    name: string;
    type: string;
    file: Buffer;
    contentType: string;
  }[];
}) {
  try {
    const patients = await readData<Patient[]>("patients", []);
    const patientIndex = patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return { success: false, error: 'Patient not found' };
    }
    
    const now = new Date().toISOString();
    
    // Calculate age if date of birth is provided
    let age = patients[patientIndex].age;
    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    
    // Process new documents if provided
    const processedDocuments = [...(patients[patientIndex].documents || [])];
    if (data.documents && data.documents.length > 0) {
      for (const doc of data.documents) {
        const key = generateFileKey('patients', doc.name);
        const url = await uploadFile(doc.file, key, doc.contentType);
        
        processedDocuments.push({
          id: `doc-${Math.random().toString(36).substring(2, 10)}`,
          documentId: `DOC${Math.floor(100000 + Math.random() * 900000)}`,
          name: doc.name,
          type: doc.type,
          url: url,
          size: doc.file.length,
          patientId: id,
          uploadedById: patients[patientIndex].createdById,
          clinicId: patients[patientIndex].clinicId,
          createdAt: now,
          updatedAt: now
        });
      }
    }
    
    const updatedData = {
      ...data,
      age,
      documents: processedDocuments,
      updatedAt: now
    };
    
    const updatedPatient = {
      ...patients[patientIndex],
      ...updatedData
    };
    
    patients[patientIndex] = updatedPatient;
    await writeData("patients", patients);
    
    return { success: true, patient: updatedPatient };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Failed to update patient' };
  }
}

export async function deletePatientRecord(id: string) {
  try {
    const patients = await readData<Patient[]>("patients", []);
    const patient = patients.find(p => p.id === id);
    
    if (!patient) {
      return { success: false, error: 'Patient not found' };
    }
    
    // Delete associated documents from S3
    if (patient.documents && patient.documents.length > 0) {
      for (const doc of patient.documents) {
        if (doc.url) {
          // Extract the key from the URL
          const urlParts = new URL(doc.url);
          const key = urlParts.pathname.substring(1); // Remove leading slash
          
          try {
            await deleteFile(key);
          } catch (error) {
            console.error(`Error deleting file ${key}:`, error);
            // Continue with deletion even if file removal fails
          }
        }
      }
    }
    
    // Remove patient from database
    const updatedPatients = patients.filter(p => p.id !== id);
    await writeData("patients", updatedPatients);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
}

export async function getPatients(clinicId?: string) {
  try {
    const patients = await readData<Patient[]>("patients", []);
    
    // Filter by clinicId if provided
    const filteredPatients = clinicId 
      ? patients.filter(p => p.clinicId === clinicId)
      : patients;
    
    // Sort by createdAt in descending order
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
    const patient = await findById<Patient>("patients", id);
    
    if (!patient) {
      return null;
    }
    
    // Get appointments for this patient
    const appointments = await readData("appointments", []);
    const patientAppointments = appointments
      .filter(a => a.patientId === id)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    // Get doctor details for each appointment
    const doctors = await readData("doctors", []);
    
    const appointmentsWithDoctors = patientAppointments.map((appointment) => {
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      return {
        ...appointment,
        doctor,
        appointmentDate: new Date(appointment.appointmentDate)
      };
    });
    
    // Get prescriptions for this patient
    const prescriptions = await readData("prescriptions", []);
    const patientPrescriptions = prescriptions
      .filter(p => p.patientId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Get invoices for this patient
    const invoices = await readData("invoices", []);
    const patientInvoices = invoices
      .filter(i => i.patientId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      ...patient,
      appointments: appointmentsWithDoctors,
      prescriptions: patientPrescriptions,
      invoices: patientInvoices
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}

export async function addPatientDocument(patientId: string, document: {
  name: string;
  type: string;
  file: Buffer;
  contentType: string;
  uploadedById: string;
  clinicId: string;
  notes?: string;
}) {
  try {
    const patients = await readData<Patient[]>("patients", []);
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) {
      return { success: false, error: 'Patient not found' };
    }
    
    const now = new Date().toISOString();
    
    // Upload document to S3
    const key = generateFileKey('patients', document.name);
    const url = await uploadFile(document.file, key, document.contentType);
    
    // Create document object
    const newDocument = {
      id: `doc-${Math.random().toString(36).substring(2, 10)}`,
      documentId: `DOC${Math.floor(100000 + Math.random() * 900000)}`,
      name: document.name,
      type: document.type,
      url: url,
      size: document.file.length,
      patientId: patientId,
      uploadedById: document.uploadedById,
      clinicId: document.clinicId,
      notes: document.notes,
      createdAt: now,
      updatedAt: now
    };
    
    // Add document to patient
    const patient = patients[patientIndex];
    const documents = [...(patient.documents || []), newDocument];
    
    patients[patientIndex] = {
      ...patient,
      documents,
      updatedAt: now
    };
    
    await writeData("patients", patients);
    
    return { success: true, document: newDocument };
  } catch (error) {
    console.error('Error adding patient document:', error);
    return { success: false, error: 'Failed to add document' };
  }
}

export async function deletePatientDocument(patientId: string, documentId: string) {
  try {
    const patients = await readData<Patient[]>("patients", []);
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) {
      return { success: false, error: 'Patient not found' };
    }
    
    const patient = patients[patientIndex];
    const documentIndex = patient.documents?.findIndex(d => d.id === documentId);
    
    if (documentIndex === undefined || documentIndex === -1) {
      return { success: false, error: 'Document not found' };
    }
    
    const document = patient.documents[documentIndex];
    
    // Delete file from S3
    if (document.url) {
      // Extract the key from the URL
      const urlParts = new URL(document.url);
      const key = urlParts.pathname.substring(1); // Remove leading slash
      
      try {
        await deleteFile(key);
      } catch (error) {
        console.error(`Error deleting file ${key}:`, error);
        // Continue with deletion even if file removal fails
      }
    }
    
    // Remove document from patient
    const documents = patient.documents.filter(d => d.id !== documentId);
    
    patients[patientIndex] = {
      ...patient,
      documents,
      updatedAt: new Date().toISOString()
    };
    
    await writeData("patients", patients);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient document:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}