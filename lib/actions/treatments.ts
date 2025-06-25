'use server'

import { readData, writeData } from '@/lib/db';

interface Treatment {
  id: string;
  treatmentName: string;
  treatmentInCharge: string;
  treatmentCost: number;
  createdAt: string;
}

export async function getTreatments() {
  try {
    const treatments = await readData<Treatment[]>('treatments', []);
    
    if (treatments.length === 0) {
      // Mock data for demo purposes - matching the image exactly
      return [
        {
          id: '1',
          treatmentName: 'Complete Blood Count (CBC)',
          treatmentInCharge: 'K. Vijay',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-15').toISOString()
        },
        {
          id: '2',
          treatmentName: 'Lipid Profile',
          treatmentInCharge: 'P. Sandeep',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-14').toISOString()
        },
        {
          id: '3',
          treatmentName: 'Thyroid Panel',
          treatmentInCharge: 'Ch. Asritha',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-13').toISOString()
        }
      ];
    }
    
    // Convert string dates to Date objects for the client
    return treatments.map(treatment => ({
      ...treatment,
      createdAt: new Date(treatment.createdAt)
    }));
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return [];
  }
}

export async function deleteTreatment(id: string) {
  try {
    const treatments = await readData<Treatment[]>('treatments', []);
    const updatedTreatments = treatments.filter(treatment => treatment.id !== id);
    await writeData('treatments', updatedTreatments);
    return { success: true };
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return { success: false, error: 'Failed to delete treatment' };
  }
}