import { readData, createItem, updateItem, deleteItem, findById } from '@/lib/db';

export async function createTreatment(data: {
  treatmentName: string
  treatmentInChargeName: string
  treatmentCost: number
}) {
  try {
    const treatment = await createItem('treatments.json', data);
    return { success: true, treatment };
  } catch (error) {
    console.error('Error creating treatment:', error);
    return { success: false, error: 'Failed to create treatment' };
  }
}

export async function updateTreatment(id: string, data: {
  treatmentName?: string
  treatmentInChargeName?: string
  treatmentCost?: number
}) {
  try {
    const treatment = await updateItem('treatments.json', id, data);
    if (!treatment) {
      return { success: false, error: 'Treatment not found' };
    }
    return { success: true, treatment };
  } catch (error) {
    console.error('Error updating treatment:', error);
    return { success: false, error: 'Failed to update treatment' };
  }
}

export async function deleteTreatment(id: string) {
  try {
    const success = await deleteItem('treatments.json', id);
    if (!success) {
      return { success: false, error: 'Treatment not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return { success: false, error: 'Failed to delete treatment' };
  }
}

export async function getTreatments() {
  try {
    // Try to read from treatments.json
    let treatments = [];
    try {
      treatments = await readData('treatments.json');
    } catch (error) {
      // If file doesn't exist, use mock data
      treatments = [
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
        },
        {
          id: '4',
          treatmentName: 'Diabetes Panel',
          treatmentInCharge: 'P. Ravi',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-12').toISOString()
        },
        {
          id: '5',
          treatmentName: 'Liver Panel',
          treatmentInCharge: 'A. Srikanth',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-11').toISOString()
        },
        {
          id: '6',
          treatmentName: 'Kidney Panel',
          treatmentInCharge: 'P. Ravi',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-10').toISOString()
        },
        {
          id: '7',
          treatmentName: 'Vitamin Profile',
          treatmentInCharge: 'A. Srikanth',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-09').toISOString()
        },
        {
          id: '8',
          treatmentName: 'CT Scan',
          treatmentInCharge: 'P. Ravi',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-08').toISOString()
        },
        {
          id: '9',
          treatmentName: 'MRI Scan',
          treatmentInCharge: 'A. Srikanth',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-07').toISOString()
        },
        {
          id: '10',
          treatmentName: 'X-ray',
          treatmentInCharge: 'P. Ravi',
          treatmentCost: 10000,
          createdAt: new Date('2024-01-06').toISOString()
        }
      ];
      
      // Create the file with mock data
      const fs = require('fs/promises');
      const path = require('path');
      await fs.writeFile(
        path.join(process.cwd(), 'data/treatments.json'),
        JSON.stringify(treatments, null, 2)
      );
    }
    
    return treatments;
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return [];
  }
}

export async function getTreatmentById(id: string) {
  try {
    const treatments = await getTreatments();
    return treatments.find(treatment => treatment.id === id) || null;
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return null;
  }
}