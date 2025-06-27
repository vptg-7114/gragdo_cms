'use server'

import { readData, writeData, findById, getRelatedData } from '@/lib/db';
import { Prescription, Patient, Doctor, EnhancedPrescription } from '@/lib/types';

interface RawPrescription {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis?: string;
  medications?: string;
  createdAt: string;
}

export async function getPrescriptions(clinicId?: string, doctorId?: string, patientId?: string) {
  try {
    const rawPrescriptions = await readData<RawPrescription[]>('prescriptions', []);
    
    if (rawPrescriptions.length === 0) {
      // Return mock data for demo purposes
      return [
        {
          id: '1',
          patientId: '123456',
          patientName: 'K. Vijay',
          doctorName: 'K. Ranganath',
          concern: 'Heart problem',
          gender: 'M',
          age: 22,
          reports: [
            {
              id: '1',
              name: 'Blood Test Report.pdf',
              type: 'PDF',
              url: '/mock-reports/blood-test.pdf',
              size: '2.4 MB'
            },
            {
              id: '2',
              name: 'ECG Report.jpg',
              type: 'Image',
              url: '/mock-reports/ecg.jpg',
              size: '1.8 MB'
            }
          ],
          prescriptions: [
            {
              id: '1',
              name: 'Prescription_Jan_2024.pdf',
              type: 'PDF',
              url: '/mock-prescriptions/prescription-jan.pdf',
              size: '1.2 MB'
            }
          ],
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          patientId: '454575',
          patientName: 'P. Sandeep',
          doctorName: 'L. Satya',
          concern: 'General checkup',
          gender: 'M',
          age: 30,
          reports: [
            {
              id: '3',
              name: 'General Checkup Report.pdf',
              type: 'PDF',
              url: '/mock-reports/general-checkup.pdf',
              size: '3.1 MB'
            }
          ],
          prescriptions: [
            {
              id: '2',
              name: 'Prescription_Jan_2024.pdf',
              type: 'PDF',
              url: '/mock-prescriptions/prescription-jan-2.pdf',
              size: '1.5 MB'
            }
          ],
          createdAt: new Date('2024-01-10')
        },
        {
          id: '3',
          patientId: '787764',
          patientName: 'Ch. Asritha',
          doctorName: 'G. Anitha',
          concern: 'PCOD',
          gender: 'F',
          age: 25,
          reports: [
            {
              id: '4',
              name: 'Ultrasound Report.pdf',
              type: 'PDF',
              url: '/mock-reports/ultrasound.pdf',
              size: '2.8 MB'
            },
            {
              id: '5',
              name: 'Hormone Test.pdf',
              type: 'PDF',
              url: '/mock-reports/hormone-test.pdf',
              size: '1.9 MB'
            }
          ],
          prescriptions: [
            {
              id: '3',
              name: 'PCOD_Treatment_Plan.pdf',
              type: 'PDF',
              url: '/mock-prescriptions/pcod-treatment.pdf',
              size: '2.2 MB'
            }
          ],
          createdAt: new Date('2024-01-08')
        }
      ];
    }
    
    // Filter prescriptions if parameters are provided
    let filteredPrescriptions = rawPrescriptions;
    
    if (clinicId) {
      filteredPrescriptions = filteredPrescriptions.filter(p => {
        const prescription = p as unknown as Prescription;
        return prescription.clinicId === clinicId;
      });
    }
    
    if (doctorId) {
      filteredPrescriptions = filteredPrescriptions.filter(p => p.doctorId === doctorId);
    }
    
    if (patientId) {
      filteredPrescriptions = filteredPrescriptions.filter(p => p.patientId === patientId);
    }
    
    // Enrich prescriptions with patient and doctor data
    const patients = await readData<Patient[]>('patients', []);
    const doctors = await readData<Doctor[]>('doctors', []);
    
    const enrichedPrescriptions: EnhancedPrescription[] = filteredPrescriptions.map(prescription => {
      const patient = patients.find(p => p.id === prescription.patientId);
      const doctor = doctors.find(d => d.id === prescription.doctorId);
      
      // Create a default prescription document
      const defaultPrescriptionDoc = {
        id: `${prescription.id}-default`,
        name: `Prescription_${new Date(prescription.createdAt).toLocaleDateString().replace(/\//g, '_')}.pdf`,
        type: 'PDF',
        url: `/mock-prescriptions/prescription-${prescription.id}.pdf`,
        size: '1.2 MB'
      };
      
      return {
        id: prescription.id,
        patientId: prescription.patientId,
        patientName: patient?.name || 'Unknown Patient',
        doctorName: doctor?.name || 'Unknown Doctor',
        concern: prescription.diagnosis || 'General consultation',
        gender: patient?.gender || 'MALE',
        age: patient?.age || 0,
        reports: [], // Default empty array for reports
        prescriptions: [defaultPrescriptionDoc], // Always provide at least one prescription document
        createdAt: new Date(prescription.createdAt)
      };
    });
    
    // Sort by createdAt in descending order
    return enrichedPrescriptions.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return [];
  }
}

export async function createPrescription(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  diagnosis: string;
  medications: string;
  instructions?: string;
  followUpDate?: string;
}) {
  try {
    const now = new Date().toISOString();
    
    const prescriptions = await readData<Prescription[]>('prescriptions', []);
    
    const newPrescription: Prescription = {
      id: `prs-${(prescriptions.length + 1).toString().padStart(3, '0')}`,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    prescriptions.push(newPrescription);
    await writeData('prescriptions', prescriptions);
    
    return { success: true, prescription: newPrescription };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const prescription = await findById<Prescription>('prescriptions', id);
    
    if (!prescription) {
      return null;
    }
    
    const patient = await findById<Patient>('patients', prescription.patientId);
    const doctor = await findById<Doctor>('doctors', prescription.doctorId);
    
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