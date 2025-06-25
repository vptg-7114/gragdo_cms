'use server'

import { readData, writeData } from '@/lib/db';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  concern: string;
  gender: string;
  age: number;
  reports: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  prescriptions: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  createdAt: string;
}

export async function getPrescriptions() {
  try {
    const prescriptions = await readData<Prescription[]>('prescriptions', []);
    
    if (prescriptions.length === 0) {
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
          createdAt: new Date('2024-01-15').toISOString()
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
          createdAt: new Date('2024-01-10').toISOString()
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
          createdAt: new Date('2024-01-08').toISOString()
        }
      ];
    }
    
    // Convert string dates to Date objects for the client
    return prescriptions.map(prescription => ({
      ...prescription,
      createdAt: new Date(prescription.createdAt)
    }));
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return [];
  }
}