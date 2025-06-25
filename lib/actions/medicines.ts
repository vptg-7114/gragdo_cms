'use server'

import { readData, writeData } from '@/lib/db';

interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  type: string;
  dosage: string;
  manufacturedDate: string;
  expiryDate: string;
  price: string;
}

export async function getMedicines() {
  try {
    const medicines = await readData<Medicine[]>('medicines', []);
    
    if (medicines.length === 0) {
      // Mock data for demo purposes
      return [
        {
          id: '1',
          name: 'Medicine name',
          manufacturer: 'Cipla',
          batchNumber: '123456',
          type: 'Tablets',
          dosage: '500mg',
          manufacturedDate: '30-05-2025',
          expiryDate: '05-06-2027',
          price: '100'
        },
        {
          id: '2',
          name: 'Medicine name',
          manufacturer: 'Cipla',
          batchNumber: '123456',
          type: 'Capsules',
          dosage: '500mg',
          manufacturedDate: '30-05-2025',
          expiryDate: '05-06-2027',
          price: '100'
        },
        {
          id: '3',
          name: 'Medicine name',
          manufacturer: 'Cipla',
          batchNumber: '123456',
          type: 'Syrups',
          dosage: '500mg',
          manufacturedDate: '30-05-2025',
          expiryDate: '05-06-2027',
          price: '100'
        }
      ];
    }
    
    return medicines;
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }
}

export async function deleteMedicine(id: string) {
  try {
    const medicines = await readData<Medicine[]>('medicines', []);
    const updatedMedicines = medicines.filter(medicine => medicine.id !== id);
    await writeData('medicines', updatedMedicines);
    return { success: true };
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return { success: false, error: 'Failed to delete medicine' };
  }
}